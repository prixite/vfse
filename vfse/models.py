from django.db import models
from django.conf import settings

class Folder(models.Model):
    name = models.CharField(max_length=30)
    category = models.ManyToManyField("Category")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Category(models.Model):
    name = models.CharField(max_length=20)

    class Meta:
        verbose_name_plural = "Categories"

class Document(models.Model):
    folder = models.ForeignKey('Folder',on_delete=models.PROTECT)
    text = models.TextField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.SET_NULL,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)