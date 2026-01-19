from rest_framework import serializers
from .models import Plan

class PlanSerializer(serializers.ModelSerializer):
    name = serializers.CharField(max_length = 100)
    duration= serializers.CharField(max_length=10000,default="No duration available")
    price= serializers.CharField(max_length = 10)


    class Meta:
        model = Plan
        fields = '__all__'