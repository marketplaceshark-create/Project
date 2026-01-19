# Path: backend/product_sell/models.py
from django.db import models
from category.models import Category
from customer.models import Customer
from product.models import Product  

class ProductSell(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sell_posts', null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sell_listings', null=True) 
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='sell_products', null=True, blank=True)
    image = models.FileField(upload_to='sell_uploads/', blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True, default="General")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    description = models.CharField(max_length=500)
    sellerName = models.CharField(max_length=50) 
    phoneNo = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        # Safe string representation
        p_name = self.product.productName if self.product else "Unknown Product"
        return f"{p_name} by {self.sellerName}"