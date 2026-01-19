from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Customer, PasswordResetToken
from .serializer import CustomerSerializer
import requests
import os
from django.utils import timezone

TELEGRAM_BOT_TOKEN = os.environ.get("TLGRMTKN")

# --- 1. LOGIN ---
class LoginAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            customer = Customer.objects.get(email=email)
            if customer.password == password:
                serializer = CustomerSerializer(customer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Incorrect Password"}, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({"error": "Email not found."}, status=status.HTTP_404_NOT_FOUND)

# --- 2. FORGOT PASSWORD (SEND LINK) ---
class ForgotPasswordLinkAPI(APIView):
    def post(self, request):
        if not TELEGRAM_BOT_TOKEN:
            return Response({"error": "Server Config Error: Telegram Token Missing"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        email = request.data.get('email')
        chat_id = request.data.get('chat_id')

        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            return Response({"error": "Email not registered."}, status=status.HTTP_404_NOT_FOUND)

        if not chat_id:
             return Response({"error": "Chat ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Create Token
        reset_obj = PasswordResetToken.objects.create(user_email=email)
        
        # Link to Frontend (Adjust port if needed)
        # Assuming frontend is serving reset_password.html
        reset_link = f"http://127.0.0.1:5500/frontend/reset_password.html?token={reset_obj.token}"
        
        # Send Telegram Message
        message = f"🔑 *Agrivendia Password Reset*\nHello {customer.name},\n\nClick here to reset:\n{reset_link}\n\n(Link expires in 30 mins)"
        telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = { "chat_id": chat_id, "text": message, "parse_mode": "Markdown" }
        
        try:
            requests.post(telegram_url, data=data)
            return Response({"message": "Reset link sent to Telegram!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- 3. RESET PASSWORD (VERIFY & CHANGE) ---
class ResetPasswordAPI(APIView):
    def post(self, request):
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        if not token or not new_password:
            return Response({"error": "Missing token or password"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            reset_obj = PasswordResetToken.objects.get(token=token)
            
            # Check Expiry (30 mins)
            time_diff = timezone.now() - reset_obj.created_at
            if time_diff.total_seconds() > 1800: 
                reset_obj.delete()
                return Response({"error": "Link expired."}, status=status.HTTP_400_BAD_REQUEST)
            
            # Change Password
            customer = Customer.objects.get(email=reset_obj.user_email)
            customer.password = new_password
            customer.save()
            
            # Delete Token
            reset_obj.delete()
            
            return Response({"message": "Password updated successfully!"}, status=status.HTTP_200_OK)

        except PasswordResetToken.DoesNotExist:
            return Response({"error": "Invalid Token"}, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

# --- 4. CRUD ---
class CustomerAPI(APIView):
    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, id=None):
        if id:
            try:
                customer = Customer.objects.get(id=id)
            except Customer.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = CustomerSerializer(customer)
            return Response(serializer.data)
        customers = Customer.objects.all()
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)