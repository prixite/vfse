from django.conf import settings
from django.db import models


class Folder(models.Model):
    name = models.CharField(max_length=30)
    categories = models.ManyToManyField("Category", related_name="categories")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Category(models.Model):
    name = models.CharField(max_length=20)

    class Meta:
        verbose_name_plural = "Categories"


class Document(models.Model):
    folder = models.ForeignKey(
        "Folder", on_delete=models.PROTECT, related_name="documents"
    )
    text = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
