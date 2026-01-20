# Path: backend/product_sell/serializer.py
from rest_framework import serializers
from .models import ProductSell
# Import the shared utility
from agrivendia.utils import Base64ImageField

class ProductSellSerializer(serializers.ModelSerializer):
    productName = serializers.ReadOnlyField(source='product.productName')
    productImage = serializers.ReadOnlyField(source='product.productImage')
    sellerName = serializers.ReadOnlyField(source='customer.name')
    phoneNo = serializers.ReadOnlyField(source='customer.phone')
    
    # Use the imported field
    image = Base64ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductSell
        fields = '__all__'
        read_only_fields = ['created_at'] 

    def validate_price(self, value):
        if value <= 0: raise serializers.ValidationError('Price must be positive')
        return value