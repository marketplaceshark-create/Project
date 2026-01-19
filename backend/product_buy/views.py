from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductBuy
from .serializer import ProductBuySerializer
from customer.models import Customer

class ProductBuyAPI(APIView):
    def post(self, request):
        serializer = ProductBuySerializer(data=request.data)
        if serializer.is_valid():
            try:
                # 1. Get Customer ID
                customer_id = request.data.get('customer')
                
                # 2. Fetch Customer Details
                current_customer = Customer.objects.get(id=customer_id)
                
                # 3. Save listing with Customer's Name
                serializer.save(buyerName=current_customer.name)
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Customer.DoesNotExist:
                 return Response({"error": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ... (Keep get, put, delete methods as they were) ...
    def get(self, request, id=None):
        if id:
            try:
                productBuy = ProductBuy.objects.get(id=id)
            except ProductBuy.DoesNotExist:
                return Response({"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductBuySerializer(productBuy)
            return Response(serializer.data)

        productsBuy = ProductBuy.objects.all()
        
        category_id = request.query_params.get('category_id')
        if category_id:
            productsBuy = productsBuy.filter(product__category_id=category_id)

        customer_id = request.query_params.get('customer_id')
        if customer_id:
            productsBuy = productsBuy.filter(customer_id=customer_id)
            
        serializer = ProductBuySerializer(productsBuy, many=True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            productBuy = ProductBuy.objects.get(id=id)
        except ProductBuy.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductBuySerializer(productBuy, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            productBuy = ProductBuy.objects.get(id=id)
        except ProductBuy.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
        productBuy.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)