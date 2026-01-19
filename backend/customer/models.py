from django.db import models

# Create your models here.
class Customer(models.Model):
    name = models.CharField(max_length = 100)
    email = models.EmailField(unique = True)
    phone = models.CharField(max_length = 10)
    address = models.TextField(blank = True)
    password = models.CharField(max_length=100,default='None')
    created_at = models.DateTimeField(auto_now_add= True)

    def __str__(self):
        return self.name
