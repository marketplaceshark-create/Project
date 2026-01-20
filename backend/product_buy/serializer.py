# Path: backend/product_buy/serializer.py
from rest_framework import serializers
from .models import ProductBuy
# Import the shared utility
from agrivendia.utils import Base64ImageField

class ProductBuySerializer(serializers.ModelSerializer):
    productName = serializers.ReadOnlyField(source='product.productName')
    productImage = serializers.ReadOnlyField(source='product.productImage')
    buyerName = serializers.ReadOnlyField(source='customer.name')

    # Use the imported field
    image = Base64ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductBuy
        fields = '__all__'
        read_only_fields = ['created_at']