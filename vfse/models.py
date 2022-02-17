from django.db import models


class Folder(models.Model):
    name = models.CharField(max_length=30)
    catergory = models.ManyToManyField('Category')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Category(models.Model):
    name = models.CharField(max_length=20)

