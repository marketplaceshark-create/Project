from django.db import models
from category.models import Category
from customer.models import Customer
from product.models import Product  

class ProductSell(models.Model):
    UNIT_CHOICES = (
        ('kg', 'Kilograms (kg)'),
        ('ton', 'Metric Tons'),
        ('quintal', 'Quintals'),
        ('g', 'Grams'),
        ('lb', 'Pounds'),
        ('l', 'Litres'),
        ('ml', 'Millilitres'),
        ('box', 'Boxes'),
        ('crate', 'Crates'),
        ('dozen', 'Dozens'),
        ('piece', 'Pieces/Numbers'),
        ('barrel', 'Barrels'),
        ('bag', 'Bags/Sacks'),
        ('bunch', 'Bunches')
    )

    # Foreign Keys serve as the Source of Truth
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='sell_posts')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sell_listings', null=True) 
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='sell_products', null=True, blank=True)
    
    image = models.FileField(upload_to='sell_uploads/', blank=True, null=True)
    name = models.CharField(max_length=50, blank=True, null=True, default="General")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    description = models.CharField(max_length=500)
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='kg')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.customer.name}"