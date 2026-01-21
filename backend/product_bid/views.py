# Path: backend/product_bid/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProductBid
from .serializer import ProductBidSerializer

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
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id):
        try:
            bid = ProductBid.objects.get(id=id)
        except ProductBid.DoesNotExist:
            return Response({"error": "Bid not found"}, status=status.HTTP_404_NOT_FOUND)

        # FIXED: SECURITY - Only allow updating the 'status' field via PUT
        # This prevents users/frontend from accidentally modifying price/qty during acceptance
        status_update = request.data.get('status')
        if not status_update:
            return Response({"error": "Only status updates allowed"}, status=status.HTTP_400_BAD_REQUEST)

        bid.status = status_update
        bid.save()
        
        serializer = ProductBidSerializer(bid)
        return Response(serializer.data)