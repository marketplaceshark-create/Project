# Path: backend/customer/serializer.py
from rest_framework import serializers
from .models import Customer
# Import the shared utility
from agrivendia.utils import Base64ImageField

class CustomerSerializer(serializers.ModelSerializer):
    # Map the model field to the Base64 logic
    profile_image = Base64ImageField(required=False, allow_null=True)

    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['created_at']