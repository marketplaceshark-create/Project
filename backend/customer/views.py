from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Customer
from .serializer import CustomerSerializer
import random
import requests
import os

# Temporary storage for OTPs (In memory)
OTP_STORAGE = {} 
TELEGRAM_BOT_TOKEN =  os.environ.get("TLGRMTKN")
if not TELEGRAM_BOT_TOKEN:
    print("⚠️ WARNING: Telegram Token not found in environment variables.")

# 1. LOGIN API
class LoginAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            # Check if user exists
            customer = Customer.objects.get(email=email)
            # Check password
            if customer.password == password:
                serializer = CustomerSerializer(customer)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Incorrect Password"}, status=status.HTTP_400_BAD_REQUEST)
        except Customer.DoesNotExist:
            return Response({"error": "Email not found. Please Register."}, status=status.HTTP_404_NOT_FOUND)

# 2. SEND OTP
class SendTelegramOTP(APIView):
    def post(self, request):
        if not TELEGRAM_BOT_TOKEN:
            return Response({"error": "Server configuration error: Telegram Token missing"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        phone = request.data.get('phone')
        chat_id = request.data.get('chat_id') 
        
        try:
            customer = Customer.objects.get(phone=phone)
        except Customer.DoesNotExist:
            return Response({"error": "Phone number not registered."}, status=status.HTTP_404_NOT_FOUND)

        if not chat_id:
             return Response({"error": "Chat ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Generate OTP
        otp = str(random.randint(1000, 9999))
        OTP_STORAGE[phone] = otp
        
        # Send to Telegram
        message = f"🔐 Agrivendia OTP: {otp}\nUser: {customer.name}"
        telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {
            "chat_id": chat_id, 
            "text": message
        }
        
        try:
            requests.post(telegram_url, data=data)
            return Response({"message": "OTP sent to your Telegram!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Telegram API Error: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 3. VERIFY OTP (Does NOT delete OTP yet, just checks it)
class VerifyTelegramOTP(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp_entered = request.data.get('otp')

        if phone in OTP_STORAGE and str(OTP_STORAGE[phone]) == str(otp_entered):
            # Return success but keep OTP in memory for the next step (Reset Password)
            return Response({"message": "OTP Verified"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

# 4. RESET PASSWORD (New API)
class ResetPasswordAPI(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp_entered = request.data.get('otp')
        new_password = request.data.get('new_password')

        # Security Check: Verify OTP again
        if phone in OTP_STORAGE and str(OTP_STORAGE[phone]) == str(otp_entered):
            try:
                customer = Customer.objects.get(phone=phone)
                customer.password = new_password # Set New Password
                customer.save()
                
                del OTP_STORAGE[phone] # NOW delete the OTP
                return Response({"message": "Password changed successfully!"}, status=status.HTTP_200_OK)
            except Customer.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Session expired or Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

# Standard CRUD
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