from django.db import models
from customer.models import Customer
from product_sell.models import ProductSell
from product_buy.models import ProductBuy

class ProductBid(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
    )

    # Who is bidding?
    bidder = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='bids')
    
    # What are they bidding on? (One will be null)
    sell_post = models.ForeignKey(ProductSell, on_delete=models.CASCADE, null=True, blank=True, related_name='bids')
    buy_post = models.ForeignKey(ProductBuy, on_delete=models.CASCADE, null=True, blank=True, related_name='bids')

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    message = models.CharField(max_length=500, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bidder.name} - {self.amount}"