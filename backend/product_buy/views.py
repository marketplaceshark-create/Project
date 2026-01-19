from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductBuy
from .serializer import ProductBuySerializer
from customer.models import Customer

class ProductBuyAPI(APIView):
    
    # --- OWNERSHIP HELPER ---
    def validate_ownership(self, product_buy, request_data):
        requester_id = request_data.get('customer') or self.request.query_params.get('customer')
        if not requester_id: return False
        return str(product_buy.customer.id) == str(requester_id)

    def post(self, request):
        serializer = ProductBuySerializer(data=request.data)
        if serializer.is_valid():
            try:
                customer_id = request.data.get('customer')
                current_customer = Customer.objects.get(id=customer_id)
                serializer.save(customer=current_customer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Customer.DoesNotExist:
                 return Response({"error": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        if category_id: productsBuy = productsBuy.filter(product__category_id=category_id)

        customer_id = request.query_params.get('customer_id')
        if customer_id: productsBuy = productsBuy.filter(customer_id=customer_id)
            
        serializer = ProductBuySerializer(productsBuy, many=True)
        return Response(serializer.data)
    
    def put(self, request, id):
        try:
            productBuy = ProductBuy.objects.get(id=id)
        except ProductBuy.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not self.validate_ownership(productBuy, request.data):
             return Response({"error": "Permission Denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ProductBuySerializer(productBuy, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            productBuy = ProductBuy.objects.get(id=id)
        except ProductBuy.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        if not self.validate_ownership(productBuy, request.data):
             return Response({"error": "Permission Denied"}, status=status.HTTP_403_FORBIDDEN)

        productBuy.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)