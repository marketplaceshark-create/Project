# Path: backend/product/models.py
from django.db import models
from category.models import Category

class Product(models.Model):
    productName = models.CharField(max_length=100)
    productDescription = models.CharField(max_length=1000)
    
    # Linked directly to Category
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', null=True)
    
    # Image stored here so it appears automatically for all sellers/buyers of this product
    productImage = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.productName