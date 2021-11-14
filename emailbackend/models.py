from django.db import models


class Email(models.Model):
    email_from = models.CharField(max_length=100)
    email_to = models.CharField(max_length=100)
    body = models.TextField()
    html = models.TextField(null=True, blank=True)
    attachment = models.FileField(null=True, blank=True)
    subject = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
