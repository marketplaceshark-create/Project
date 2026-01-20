# Path: backend/product_bid/serializer.py
from rest_framework import serializers
from .models import ProductBid
from customer.serializer import CustomerSerializer

class ProductBidSerializer(serializers.ModelSerializer):
    # Nested serializer to show bidder name in frontend easily
    bidder_details = CustomerSerializer(source='bidder', read_only=True)
    
    # FIX 3: Expose Owner Phone numbers for Bidders viewing their accepted bids
    sell_post_phone = serializers.ReadOnlyField(source='sell_post.customer.phone')
    buy_post_phone = serializers.ReadOnlyField(source='buy_post.customer.phone')

    class Meta:
        model = ProductBid
        fields = '__all__'