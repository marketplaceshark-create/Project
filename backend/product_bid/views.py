# Path: backend/product_bid/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import ProductBid
from .serializer import ProductBidSerializer
from utils import notify_user 

class ProductBidAPI(APIView):
    
    def get(self, request, id=None):
        sell_id = request.query_params.get('sell_id')
        buy_id = request.query_params.get('buy_id')

        bids = ProductBid.objects.all().order_by('-created_at')

        if sell_id:
            bids = bids.filter(sell_post_id=sell_id)
        elif buy_id:
            bids = bids.filter(buy_post_id=buy_id)
        
        serializer = ProductBidSerializer(bids, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductBidSerializer(data=request.data)
        
        if serializer.is_valid():
            data = serializer.validated_data
            available_qty = 0
            
            if data.get('sell_post'):
                available_qty = data['sell_post'].quantity
            elif data.get('buy_post'):
                available_qty = data['buy_post'].quantity
                
            if data['quantity'] > available_qty:
                 return Response(
                     {"error": f"Bid quantity ({data['quantity']}) exceeds available stock ({available_qty})"}, 
                     status=status.HTTP_400_BAD_REQUEST
                 )

            serializer.save()
            post_owner = data['sell_post'].customer if data.get('sell_post') else data['buy_post'].customer
            notify_user(post_owner.email, "New Bid Received", f"You have a new bid of {data['amount']}")
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        try:
            bid = ProductBid.objects.get(id=id)
        except ProductBid.DoesNotExist:
            return Response({"error": "Bid not found"}, status=status.HTTP_404_NOT_FOUND)

        status_update = request.data.get('status')
        if not status_update:
            return Response({"error": "Only status updates allowed"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. CANCELLED LOGIC
        if status_update == 'CANCELLED':
            if bid.status != 'PENDING':
                return Response({"error": "Only pending bids can be cancelled"}, status=status.HTTP_400_BAD_REQUEST)
            
            bid.status = 'CANCELLED'
            bid.save()
            return Response(ProductBidSerializer(bid).data)

        # 2. ACCEPTED LOGIC (With Inventory Deduction)
        if status_update == 'ACCEPTED':
            try:
                with transaction.atomic():
                    if bid.sell_post:
                        post = bid.sell_post.__class__.objects.select_for_update().get(id=bid.sell_post.id)
                        related_bids = ProductBid.objects.filter(sell_post=post, status='PENDING').exclude(id=bid.id)
                    elif bid.buy_post:
                        post = bid.buy_post.__class__.objects.select_for_update().get(id=bid.buy_post.id)
                        related_bids = ProductBid.objects.filter(buy_post=post, status='PENDING').exclude(id=bid.id)
                    else:
                        raise Exception("Bid is not linked to any post")

                    if post.quantity < bid.quantity:
                        bid.status = 'INVALID'
                        bid.save()
                        return Response(
                            {"error": "Insufficient Quantity. Stock changed before you accepted."}, 
                            status=status.HTTP_409_CONFLICT
                        )

                    post.quantity -= bid.quantity
                    post.save()

                    bid.status = 'ACCEPTED'
                    bid.save()

                    notify_user(bid.bidder.email, "Bid Accepted!", 
                                f"Your bid was accepted. Contact {post.customer.phone} to finalize.")

                    for other_bid in related_bids:
                        if other_bid.quantity > post.quantity:
                            other_bid.status = 'INVALID'
                            other_bid.save()
                            notify_user(other_bid.bidder.email, "Bid Invalidated", 
                                        "The post quantity dropped below your requested amount.")

                    serializer = ProductBidSerializer(bid)
                    return Response(serializer.data)

            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # 3. REJECTED LOGIC
        else:
            bid.status = status_update
            bid.save()
            if status_update == 'REJECTED':
                notify_user(bid.bidder.email, "Bid Rejected", "Your bid was rejected by the owner.")
            
            serializer = ProductBidSerializer(bid)
            return Response(serializer.data)