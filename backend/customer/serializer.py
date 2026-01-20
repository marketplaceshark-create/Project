from rest_framework import serializers
from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    '''name = serializers.CharField(max_length = 100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length = 10)
    address = serializers.CharField()
    password = serializers.CharField(max_length=100)
    created_at = serializers.DateTimeField(auto_now = True)'''



    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['created_at']