# Path: backend/customer/models.py
from django.db import models
import uuid

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    address = models.TextField(blank=True)
    password = models.CharField(max_length=100)
    
    # NEW FIELD
    profile_image = models.FileField(upload_to='customer_profiles/', blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class PasswordResetToken(models.Model):
    user_email = models.EmailField()
    token = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_email} - {self.token}"