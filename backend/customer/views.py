from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Customer, PasswordResetToken
from .serializer import CustomerSerializer
import requests
import os
import re
from django.utils import timezone

TELEGRAM_BOT_TOKEN = os.environ.get("TLGRMTKN")

# =====================================================
# 1️⃣ LOGIN API
# =====================================================
class LoginAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response(
                {"error": "Email and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            customer = Customer.objects.get(email=email)
            if customer.password == password:
                serializer = CustomerSerializer(customer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Incorrect Password"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Customer.DoesNotExist:
            return Response(
                {"error": "Email not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# =====================================================
# 2️⃣ CUSTOMER CRUD (With Strong Password Validation)
# =====================================================
class CustomerAPI(APIView):

    # CREATE
    def post(self, request):
        password = request.data.get('password')

        # 🔐 Password strength regex
        password_regex = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"

        if password and not re.match(password_regex, password):
            return Response(
                {
                    "error": (
                        "Password too weak. "
                        "Must contain at least 8 characters, "
                        "one uppercase, one lowercase, one number, "
                        "and one special character."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # READ
    def get(self, request, id=None):
        if id:
            try:
                customer = Customer.objects.get(id=id)
                serializer = CustomerSerializer(customer)
                return Response(serializer.data)
            except Customer.DoesNotExist:
                return Response(
                    {"error": "Customer not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    # UPDATE (Partial update enabled)
    def put(self, request, id):
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response(
                {"error": "Customer not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CustomerSerializer(
            customer,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    def delete(self, request, id):
        try:
            customer = Customer.objects.get(id=id)
            customer.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Customer.DoesNotExist:
            return Response(
                {"error": "Customer not found"},
                status=status.HTTP_404_NOT_FOUND
            )


# =====================================================
# 3️⃣ FORGOT PASSWORD (SEND TELEGRAM LINK)
# =====================================================
class ForgotPasswordLinkAPI(APIView):
    def post(self, request):
        if not TELEGRAM_BOT_TOKEN:
            return Response(
                {"error": "Server Config Error: Telegram Token Missing"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        email = request.data.get('email')
        chat_id = request.data.get('chat_id')

        if not email or not chat_id:
            return Response(
                {"error": "Email and Chat ID are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            return Response(
                {"error": "Email not registered"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create reset token
        reset_obj = PasswordResetToken.objects.create(
            user_email=email
        )

        # Frontend reset link
        reset_link = (
            "http://127.0.0.1:5500/frontend/reset_password.html"
            f"?token={reset_obj.token}"
        )

        # Telegram message
        message = (
            "🔑 *Agrivendia Password Reset*\n\n"
            f"Hello {customer.name},\n\n"
            "Click the link below to reset your password:\n"
            f"{reset_link}\n\n"
            "_This link expires in 30 minutes_"
        )

        telegram_url = (
            f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        )

        data = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "Markdown"
        }

        try:
            requests.post(telegram_url, data=data)
            return Response(
                {"message": "Password reset link sent to Telegram"},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =====================================================
# 4️⃣ RESET PASSWORD (VERIFY TOKEN & UPDATE)
# =====================================================
class ResetPasswordAPI(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not token or not new_password:
            return Response(
                {"error": "Token and new password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            reset_obj = PasswordResetToken.objects.get(token=token)

            # ⏰ Check expiry (30 minutes)
            time_diff = timezone.now() - reset_obj.created_at
            if time_diff.total_seconds() > 1800:
                reset_obj.delete()
                return Response(
                    {"error": "Reset link expired"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Update password
            customer = Customer.objects.get(
                email=reset_obj.user_email
            )
            customer.password = new_password
            customer.save()

            # Delete token after use
            reset_obj.delete()

            return Response(
                {"message": "Password updated successfully"},
                status=status.HTTP_200_OK
            )

        except PasswordResetToken.DoesNotExist:
            return Response(
                {"error": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Customer.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
