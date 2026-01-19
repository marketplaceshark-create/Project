from rest_framework import serializers
from .models import ProductBid
from customer.serializer import CustomerSerializer

class ProductBidSerializer(serializers.ModelSerializer):
    # Nested serializer to show bidder name in frontend easily
    bidder_details = CustomerSerializer(source='bidder', read_only=True)

    class Meta:
        model = ProductBid
        fields = '__all__'