# Path: backend/product_bid/serializer.py
from rest_framework import serializers
from .models import ProductBid
from customer.serializer import CustomerSerializer

class ProductBidSerializer(serializers.ModelSerializer):
    # Nested serializer to show bidder name in frontend easily
    bidder_details = CustomerSerializer(source='bidder', read_only=True)
    
    # Custom field to get the Post Owner's details (for the bidder to see)
    post_owner_details = serializers.SerializerMethodField()

    class Meta:
        model = ProductBid
        fields = '__all__'
    
    def get_post_owner_details(self, obj):
        # If this bid is on a Sell Post, return Seller's info
        if obj.sell_post and obj.sell_post.customer:
            return {
                "name": obj.sell_post.customer.name,
                "phone": obj.sell_post.customer.phone
            }
        # If this bid is on a Buy Post, return Buyer's info
        elif obj.buy_post and obj.buy_post.customer:
            return {
                "name": obj.buy_post.customer.name,
                "phone": obj.buy_post.customer.phone
            }
        return None