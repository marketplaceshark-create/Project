import csv
import io
from django.apps import apps
from category.models import Category
from customer.models import Customer
from user.models import User
from product.models import Product
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User
from .serializer import UserSerializer
import os
import random
import requests

# Storage for User (Admin) OTPs
USER_OTP_STORAGE = {} 
TELEGRAM_BOT_TOKEN =  os.environ.get("TLGRMTKN")

# --- 1. USER LOGIN ---
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

# --- 2. SEND OTP (For User/Admin) ---
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

# --- 3. VERIFY OTP ---
class VerifyUserOTP(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')
        if phone in USER_OTP_STORAGE and str(USER_OTP_STORAGE[phone]) == str(otp):
            return Response({"message": "Verified"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

# --- 4. RESET PASSWORD ---
class ResetUserPassword(APIView):
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')

        if phone in USER_OTP_STORAGE and str(USER_OTP_STORAGE[phone]) == str(otp):
            User.objects.filter(phone=phone).update(password=new_password)
            del USER_OTP_STORAGE[phone]
            return Response({"message": "User Password Updated"}, status=status.HTTP_200_OK)
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

# --- 5. CRUD API ---
class UserAPI(APIView):
    def get(self, request, id=None):
        if id:
            try:
                user = User.objects.get(id=id)
                serializer = UserSerializer(user)
                return Response(serializer.data)
            except User.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Register new Admin/User
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            user.delete()
            return Response({"message": "Deleted"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)

# Path: backend/user/views.py

# ... imports ...

class BulkUploadAPI(APIView):
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Decode file
        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        success_count = 0
        errors = []
        
        # Map URL slug to actual Model Class
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
                data = dict(row)
                
                # --- INTELLIGENT LOOKUPS ---

                # 1. PRODUCT UPLOAD: Convert Category Name -> Category Instance
                if model_name == 'product' and 'category' in data:
                    cat_name = data.pop('category')
                    cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                    if not cat_obj:
                        raise Exception(f"Category '{cat_name}' not found. Upload Categories first.")
                    data['category'] = cat_obj 

                # 2. SELL/BUY POSTS: Convert Product Name -> Product Instance
                if model_name in ['product_sell', 'product_buy']:
                    if 'product' in data:
                        prod_name = data.pop('product')
                        prod_obj = Product.objects.filter(productName__iexact=prod_name.strip()).first()
                        if not prod_obj:
                            raise Exception(f"Product '{prod_name}' not found. Upload Products first.")
                        data['product'] = prod_obj
                        
                        # Also link Category automatically from the Product
                        data['category'] = prod_obj.category

                    # 3. HANDLE SELLER/BUYER EMAIL LOOKUP
                    # Use 'seller_email' in CSV for sells, 'buyer_email' for buys
                    email_key = 'seller_email' if model_name == 'product_sell' else 'buyer_email'
                    
                    if email_key in data:
                        email = data.pop(email_key)
                        cust_obj = Customer.objects.filter(email=email.strip()).first()
                        if not cust_obj:
                            raise Exception(f"Customer with email '{email}' not found.")
                        data['customer'] = cust_obj
                        
                        # Auto-fill display fields based on the found customer
                        if model_name == 'product_sell':
                            data['sellerName'] = cust_obj.name
                            data['phoneNo'] = cust_obj.phone
                        elif model_name == 'product_buy':
                            data['buyerName'] = cust_obj.name

                # 4. HANDLE RAW CATEGORY NAME IN SELL POSTS (If product lookup didn't catch it)
                if model_name == 'product_sell' and 'category' in data and not isinstance(data.get('category'), Category):
                    cat_name = data.pop('category')
                    cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                    if cat_obj:
                        data['category'] = cat_obj

                # Create Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Uploaded {success_count} records successfully.",
            "errors": errors
        }, status=status.HTTP_200_OK)
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        success_count = 0
        errors = []
        
        # Map URL slug to actual Model Class
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
                data = dict(row)
                
                # --- INTELLIGENT LOOKUPS ---

                # 1. PRODUCT UPLOAD (Maps Category Name -> ID)
                if model_name == 'product' and 'category' in data:
                    cat_name = data.pop('category')
                    cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                    if not cat_obj:
                        raise Exception(f"Category '{cat_name}' not found. Upload Categories first.")
                    data['category'] = cat_obj 

                # 2. SELL/BUY POST UPLOAD (Maps Product Name -> ID & Seller Email -> ID)
                if model_name in ['product_sell', 'product_buy']:
                    # Lookup Product
                    if 'product' in data:
                        prod_name = data.pop('product')
                        prod_obj = Product.objects.filter(productName__iexact=prod_name.strip()).first()
                        if not prod_obj:
                            raise Exception(f"Product '{prod_name}' not found. Upload Products first.")
                        data['product'] = prod_obj
                        # Inherit Category from Product
                        data['category'] = prod_obj.category

                    # Lookup Customer (Seller/Buyer)
                    email_key = 'seller_email' if model_name == 'product_sell' else 'buyer_email'
                    if email_key in data:
                        email = data.pop(email_key)
                        cust_obj = Customer.objects.filter(email=email.strip()).first()
                        if not cust_obj:
                            raise Exception(f"Customer '{email}' not found.")
                        data['customer'] = cust_obj
                        
                        # Auto-fill display fields
                        if model_name == 'product_sell':
                            data['sellerName'] = cust_obj.name
                            data['phoneNo'] = cust_obj.phone
                        elif model_name == 'product_buy':
                            data['buyerName'] = cust_obj.name

                # 3. Create Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Uploaded {success_count} records successfully.",
            "errors": errors
        }, status=status.HTTP_200_OK)
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        success_count = 0
        errors = []
        
        # Map URL slug to actual Model Class
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
                data = dict(row)
                
                # --- INTELLIGENT LOOKUPS ---

                # 1. PRODUCT UPLOAD (Maps Category Name -> ID)
                if model_name == 'product' and 'category' in data:
                    cat_name = data.pop('category')
                    cat_obj = Category.objects.filter(name__iexact=cat_name.strip()).first()
                    if not cat_obj:
                        raise Exception(f"Category '{cat_name}' not found. Upload Categories first.")
                    data['category'] = cat_obj # Assign object directly

                # 2. SELL/BUY POST UPLOAD (Maps Product Name -> ID & Seller Email -> ID)
                if model_name in ['product_sell', 'product_buy']:
                    if 'product' in data:
                        prod_name = data.pop('product')
                        prod_obj = Product.objects.filter(productName__iexact=prod_name.strip()).first()
                        if not prod_obj:
                            raise Exception(f"Product '{prod_name}' not found. Upload Products first.")
                        data['product'] = prod_obj
                        # Inherit Category from Product to keep data consistent
                        data['category'] = prod_obj.category

                    # Lookup Customer (Seller/Buyer)
                    email_key = 'seller_email' if model_name == 'product_sell' else 'buyer_email'
                    if email_key in data:
                        email = data.pop(email_key)
                        cust_obj = Customer.objects.filter(email=email.strip()).first()
                        if not cust_obj:
                            raise Exception(f"Customer '{email}' not found.")
                        data['customer'] = cust_obj
                        
                        # Auto-fill display fields
                        if model_name == 'product_sell':
                            data['sellerName'] = cust_obj.name
                            data['phoneNo'] = cust_obj.phone
                        elif model_name == 'product_buy':
                            data['buyerName'] = cust_obj.name

                # 3. Create Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Uploaded {success_count} records successfully.",
            "errors": errors
        }, status=status.HTTP_200_OK)
    def post(self, request, model_name):
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        decoded_file = file.read().decode('utf-8')
        io_string = io.StringIO(decoded_file)
        reader = csv.DictReader(io_string)
        
        success_count = 0
        errors = []
        
        # Map URL slug to actual Model Class
        model_mapping = {
            'category': apps.get_model('category', 'Category'),
            'product_sell': apps.get_model('product_sell', 'ProductSell'),
            'customer': apps.get_model('customer', 'Customer'),
            'plan': apps.get_model('plan', 'Plan')
        }

        ModelClass = model_mapping.get(model_name)
        if not ModelClass:
            return Response({"error": "Invalid model name"}, status=status.HTTP_400_BAD_REQUEST)

        row_num = 1
        for row in reader:
            try:
                data = dict(row)
                
                # --- INTELLIGENT LOOKUPS (The "Human" logic) ---
                
                # 1. Handle Category Name -> ID
                if 'category' in data and model_name == 'product_sell':
                    cat_name = data.pop('category') # Remove name, replace with ID
                    cat_obj = Category.objects.filter(name__iexact=cat_name).first()
                    if cat_obj:
                        data['category_id'] = cat_obj.id
                    else:
                        raise Exception(f"Category '{cat_name}' not found")

                # 2. Handle Customer Email -> ID
                if 'seller_email' in data and model_name == 'product_sell':
                    email = data.pop('seller_email')
                    cust_obj = Customer.objects.filter(email=email).first()
                    if cust_obj:
                        data['customer_id'] = cust_obj.id
                        # Auto-fill text fields for display
                        data['sellerName'] = cust_obj.name
                        data['phoneNo'] = cust_obj.phone
                    else:
                        raise Exception(f"Customer email '{email}' not found")

                # 3. Create Record
                ModelClass.objects.create(**data)
                success_count += 1

            except Exception as e:
                errors.append(f"Row {row_num}: {str(e)}")
            
            row_num += 1

        return Response({
            "message": f"Uploaded {success_count} records successfully.",
            "errors": errors
        }, status=status.HTTP_200_OK)