# Path: backend/user/views.py
import csv
import io
import os
import random
import requests
from django.apps import apps
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import User
from .serializer import UserSerializer

# Models for Bulk Upload Lookups
from category.models import Category
from customer.models import Customer
from product.models import Product

# Storage for User (Admin) OTPs (In-memory)
USER_OTP_STORAGE = {} 
TELEGRAM_BOT_TOKEN = os.environ.get("TLGRMTKN")

# --- HELPER FUNCTIONS (DRY Principle) ---
def get_user_or_error(user_id):
    """
    Helper to fetch user or return standard 404 response.
    Returns: (user_object, error_response)
    """
    try:
        return User.objects.get(id=user_id), None
    except User.DoesNotExist:
        return None, Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

def validate_otp(phone, otp):
    """
    Helper to validate OTP against storage.
    """
    if phone in USER_OTP_STORAGE and str(USER_OTP_STORAGE[phone]) == str(otp):
        return True
    return False

# --- VIEWS ---

class UserLoginAPI(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Check User Table
        user = User.objects.filter(email=email).first()

        if user:
            if user.password == password:
                serializer = UserSerializer(user)
                data = serializer.data
                data['role'] = 'admin' # Mark as admin for frontend logic
                return Response(data, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Incorrect Password"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "User email not found."}, status=status.HTTP_404_NOT_FOUND)


class SendUserOTP(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        chat_id = request.data.get('chat_id')
        
        user = User.objects.filter(phone=phone).first()
        if not user:
            return Response({"error": "User phone not registered."}, status=status.HTTP_404_NOT_FOUND)
        
        if not chat_id:
             return Response({"error": "Chat ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        otp = str(random.randint(1000, 9999))
        USER_OTP_STORAGE[phone] = otp
        
        message = f"🔐 Agrivendia ADMIN OTP: {otp}\nUser: {user.name}"
        telegram_url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        data = {"chat_id": chat_id, "text": message}
        
        try:
            requests.post(telegram_url, data=data)
            return Response({"message": "OTP sent to Telegram"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyUserOTP(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')
        
        if validate_otp(phone, otp):
            return Response({"message": "Verified"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


class ResetUserPassword(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        if validate_otp(phone, otp):
            User.objects.filter(phone=phone).update(password=new_password)
            del USER_OTP_STORAGE[phone] # Clean up used OTP
            return Response({"message": "User Password Updated"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


class UserAPI(APIView):
    def get(self, request, id=None):
        if id:
            user, error_res = get_user_or_error(id)
            if error_res: return error_res
            
            serializer = UserSerializer(user)
            return Response(serializer.data)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id):
        user, error_res = get_user_or_error(id)
        if error_res: return error_res
            
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        user, error_res = get_user_or_error(id)
        if error_res: return error_res

        user.delete()
        return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)


class BulkUploadAPI(APIView):
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Decode File
        try:
            decoded_file = file.read().decode('utf-8')
            io_string = io.StringIO(decoded_file)
            reader = csv.DictReader(io_string)
        except Exception as e:
            return Response({"error": f"CSV Read Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        success_count = 0
        errors = []
        
        # 2. Map URL slug to actual Model Class
        model_mapping = {
            'category': apps.get_model('category', 'Category'),
            'product': apps.get_model('product', 'Product'),
            'product_sell': apps.get_model('product_sell', 'ProductSell'),
            'product_buy': apps.get_model('product_buy', 'ProductBuy'),
            'customer': apps.get_model('customer', 'Customer'),
            'plan': apps.get_model('plan', 'Plan')
        }

        ModelClass = model_mapping.get(model_name)
        if not ModelClass:
            return Response({"error": f"Invalid model name: {model_name}"}, status=status.HTTP_400_BAD_REQUEST)

        row_num = 1
        for row in reader:
            try:
                # Copy row to avoid modifying original CSV reader dict if needed
                data = dict(row)
                
                # --- LOGIC 1: PRODUCT UPLOAD (Map Category Name -> FK) ---
                if model_name == 'product':
                    if 'category' in data and data['category']:
                        cat_name = data.pop('category')
                        cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                        if not cat_obj:
                            raise Exception(f"Category '{cat_name}' not found. Create it first.")
                        data['category'] = cat_obj 
                    # If category is missing in CSV, product is created with category=None

                # --- LOGIC 2: SELL/BUY POSTS (Map Strings -> FKs) ---
                if model_name in ['product_sell', 'product_buy']:
                    
                    # A. Resolve Product (Name -> ID)
                    if 'product' in data:
                        prod_name = data.pop('product') # Remove string field
                        prod_obj = Product.objects.filter(productName__iexact=prod_name.strip()).first()
                        if not prod_obj:
                            raise Exception(f"Product '{prod_name}' not found.")
                        data['product'] = prod_obj
                        # Auto-link Category from the Product
                        data['category'] = prod_obj.category

                    # B. Resolve Customer (Email -> ID)
                    # Use 'seller_email' for Sells, 'buyer_email' for Buys in CSV
                    email_key = 'seller_email' if model_name == 'product_sell' else 'buyer_email'
                    
                    if email_key in data:
                        email = data.pop(email_key) # Remove email string
                        cust_obj = Customer.objects.filter(email=email.strip()).first()
                        if not cust_obj:
                            raise Exception(f"Customer with email '{email}' not found.")
                        data['customer'] = cust_obj
                    else:
                        raise Exception(f"CSV missing '{email_key}' column")

                # 3. Create Database Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Processed {row_num-1} rows. Success: {success_count}.",
            "errors": errors
        }, status=status.HTTP_200_OK)