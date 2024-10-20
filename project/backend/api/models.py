from django.db import models

# Create your models here.

class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    published_date = models.DateField()

    def __str__(self):
        return self.title

class ImageType(models.Model):
    name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Image(models.Model):
    name = models.CharField(max_length=255)
    type = models.ForeignKey(ImageType, on_delete=models.CASCADE, related_name='images')
    file = models.ImageField(upload_to='module/images/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
