from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductSell
from .serializer import ProductSellSerializer
from customer.models import Customer # Import Customer model

class ProductSellAPI(APIView):
    def post(self, request):
        serializer = ProductSellSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # 1. Get Customer ID from request
                customer_id = request.data.get('customer')
                
                # 2. Fetch Customer Details
                current_customer = Customer.objects.get(id=customer_id)
                
                # 3. Save listing with Customer's Name and Phone
                serializer.save(
                    sellerName=current_customer.name, 
                    phoneNo=current_customer.phone
                )
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Customer.DoesNotExist:
                return Response({"error": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ... (Keep get, put, delete methods as they were) ...
    def get(self, request, id=None):
        if id:
            try:
                productSell = ProductSell.objects.get(id=id)
            except ProductSell.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductSellSerializer(productSell)
            return Response(serializer.data)

        productsSell = ProductSell.objects.all()
        
        customer_id = request.query_params.get('customer_id')
        if customer_id:
            productsSell = productsSell.filter(customer_id=customer_id)

        category_id = request.query_params.get('category_id')
        if category_id:
            productsSell = productsSell.filter(product__category_id=category_id)
        
        serializer = ProductSellSerializer(productsSell, many=True)
        return Response(serializer.data)

    def put(self,request,id):
        try:
            productSell= ProductSell.objects.get(id=id)
        except ProductSell.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
            
        serializer = ProductSellSerializer(productSell, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,id):
        try:
            productSell= ProductSell.objects.get(id=id)
        except ProductSell.DoesNotExist:
            return Response({"error":"Not Found"},status=status.HTTP_404_NOT_FOUND)
        productSell.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)