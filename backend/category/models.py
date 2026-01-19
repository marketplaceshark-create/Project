from django.db import models
# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length = 50)
    description = models.CharField(max_length = 1000)
    image_url = models.CharField(max_length=500, blank=True, null=True) 
    #image= models.ImageField(upload_to="categories/",blank=True,null=True)
    #variety = models.CharField(max_length= 10)
    created_at = models.DateTimeField(auto_now_add= True)
    updated_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        
        return self.name

