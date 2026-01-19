from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductSell
from .serializer import ProductSellSerializer
from customer.models import Customer

class ProductSellAPI(APIView):
    
    # --- OWNERSHIP HELPER ---
    def validate_ownership(self, product_sell, request_data):
        # In a real app with Auth headers, use request.user.id
        # Here we rely on the body/param for training purposes
        requester_id = request_data.get('customer') or self.request.query_params.get('customer')
        if not requester_id:
             return False
        return str(product_sell.customer.id) == str(requester_id)

    def post(self, request):
        serializer = ProductSellSerializer(data=request.data)
        if serializer.is_valid():
            try:
                customer_id = request.data.get('customer')
                current_customer = Customer.objects.get(id=customer_id)
                
                # Save with foreign key relationship
                serializer.save(customer=current_customer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Customer.DoesNotExist:
                return Response({"error": "Customer not found"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        if customer_id: productsSell = productsSell.filter(customer_id=customer_id)

        category_id = request.query_params.get('category_id')
        if category_id: productsSell = productsSell.filter(product__category_id=category_id)
        
        serializer = ProductSellSerializer(productsSell, many=True)
        return Response(serializer.data)

    def put(self, request, id):
        try:
            productSell = ProductSell.objects.get(id=id)
        except ProductSell.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
            
        # Check Ownership
        if not self.validate_ownership(productSell, request.data):
             return Response({"error": "Permission Denied"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ProductSellSerializer(productSell, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        try:
            productSell = ProductSell.objects.get(id=id)
        except ProductSell.DoesNotExist:
            return Response({"error":"Not Found"}, status=status.HTTP_404_NOT_FOUND)

        # Check Ownership (Need customer ID in body or params)
        if not self.validate_ownership(productSell, request.data):
             return Response({"error": "Permission Denied"}, status=status.HTTP_403_FORBIDDEN)

        productSell.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)