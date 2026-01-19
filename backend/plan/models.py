from django.db import models

# Create your models here.
class Plan(models.Model):
    name = models.CharField(max_length = 100)
    duration= models.CharField(max_length=10000,default="No duration available")
    price = models.CharField(max_length = 10)

    def __str__(self):
        
        return self.name


