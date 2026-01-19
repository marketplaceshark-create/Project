from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length = 100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length = 10)
    password = serializers.CharField(max_length=100, default='admin123') 


    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True} 
        }