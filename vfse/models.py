from django.conf import settings
from django.db import models


class Folder(models.Model):
    name = models.CharField(max_length=30)
    categories = models.ManyToManyField("Category", related_name="folders")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Category(models.Model):
    name = models.CharField(max_length=20)
    color = models.CharField(max_length=10, default="#28D4AB")

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Document(models.Model):
    folder = models.ForeignKey(
        "Folder", on_delete=models.CASCADE, related_name="documents", null=True
    )
    categories = models.ManyToManyField("Category", related_name="documents")
    title = models.CharField(max_length=255, default="", blank=True)
    text = models.TextField()
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True
    )
    favorite = models.BooleanField(default=False)
    document_link = models.URLField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Topic(models.Model):
    user = models.ForeignKey("core.User", on_delete=models.CASCADE)
    title = models.CharField(max_length=500)
    description = models.TextField()
    followers = models.ManyToManyField(
        "core.User", related_name="followed_topics", blank=True
    )
    image = models.ImageField(null=True, blank=True)
    reply_email_notification = models.BooleanField(default=False)
    categories = models.ManyToManyField("Category", related_name="topics", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Comment(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey("core.User", on_delete=models.CASCADE)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class RecentActivity(models.Model):
    user = models.ForeignKey("core.User", on_delete=models.CASCADE)
    action = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)


class WorkOrder:
    system = models.ForeignKey("core.System", on_delete=models.CASCADE)
    description = models.TextField()
    work_started = models.BooleanField(default=False)
    work_started_at = models.DateTimeField()
    work_completed = models.BooleanField(default=False)
    work_completed_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
