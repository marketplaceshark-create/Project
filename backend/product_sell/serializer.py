from rest_framework import serializers
from .models import ProductSell
import base64
import uuid
from django.core.files.base import ContentFile

class Base64ImageField(serializers.Field):
    def to_internal_value(self, data):
        if isinstance(data, str) and data.startswith('data:image'):
            try:
                format, imgstr = data.split(';base64,') 
                ext = format.split('/')[-1] 
                id = uuid.uuid4()
                data = ContentFile(base64.b64decode(imgstr), name=f"{id}.{ext}")
            except:
                raise serializers.ValidationError("Invalid image format")
        return data

    def to_representation(self, value):
        if not value: return None
        try: return value.url
        except: return None

class ProductSellSerializer(serializers.ModelSerializer):
    # Fetch from Master Product Table
    productName = serializers.ReadOnlyField(source='product.productName')
    productImage = serializers.ReadOnlyField(source='product.productImage')
    
    # Fetch from Customer Table (Dynamic)
    sellerName = serializers.ReadOnlyField(source='customer.name')
    phoneNo = serializers.ReadOnlyField(source='customer.phone')
    
    image = Base64ImageField(required=False, allow_null=True)

    class Meta:
        model = ProductSell
        fields = '__all__'
        read_only_fields = ['created_at'] 

    def validate_price(self, value):
        if value <= 0: raise serializers.ValidationError('Price must be positive')
        return value