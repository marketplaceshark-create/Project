# Path: backend/product_bid/serializer.py
from rest_framework import serializers
from .models import ProductBid
from customer.serializer import CustomerSerializer

class ProductBidSerializer(serializers.ModelSerializer):
    # Basic bidder info (Name only usually, but we'll filter sensitivity in frontend for Pending)
    bidder_details = CustomerSerializer(source='bidder', read_only=True)
    
    # Custom field to get the Post Owner's details
    post_owner_details = serializers.SerializerMethodField()

    # NEW: Secure Contact Exchange
    contact_exchange = serializers.SerializerMethodField()

    class Meta:
        model = ProductBid
        fields = '__all__'
    
    def get_post_owner_details(self, obj):
        # Identify Owner
        owner = None
        if obj.sell_post: owner = obj.sell_post.customer
        elif obj.buy_post: owner = obj.buy_post.customer
        
        if owner:
            return {"name": owner.name} # Minimal info initially
        return None

    def get_contact_exchange(self, obj):
        """
        Returns full contact details of both parties ONLY if Accepted.
        """
        if obj.status == 'ACCEPTED':
            owner = obj.sell_post.customer if obj.sell_post else obj.buy_post.customer
            return {
                "owner_phone": owner.phone,
                "owner_email": owner.email,
                "bidder_phone": obj.bidder.phone,
                "bidder_email": obj.bidder.email
            }
        return None