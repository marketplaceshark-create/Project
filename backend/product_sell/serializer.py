# Path: backend/product_sell/serializer.py
from rest_framework import serializers
from .models import ProductSell
import base64
import uuid
from django.core.files.base import ContentFile

# Custom Field to handle Base64 decoding
class Base64ImageField(serializers.Field):
    def to_internal_value(self, data):
        # Check if this is a base64 string
        if isinstance(data, str) and data.startswith('data:image'):
            # format: "data:image/png;base64,iVBORw0KGgo..."
            try:
                format, imgstr = data.split(';base64,') 
                ext = format.split('/')[-1] 
                id = uuid.uuid4()
                data = ContentFile(base64.b64decode(imgstr), name=f"{id}.{ext}")
            except Exception as e:
                raise serializers.ValidationError("Invalid image format")
        return data

    def to_representation(self, value):
        if not value:
            return None
        try:
            return value.url
        except:
            return None

class ProductSellSerializer(serializers.ModelSerializer):
    productName = serializers.ReadOnlyField(source='product.productName')
    productImage = serializers.ReadOnlyField(source='product.productImage') # Fallback URL
    
    # Use the custom field
    image = Base64ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductSell
        fields = '__all__'
        read_only_fields = ['created_at', 'sellerName', 'phoneNo']

    def validate_price(self, value):
        if value <= 0: raise serializers.ValidationError('price must be positive')
        return value