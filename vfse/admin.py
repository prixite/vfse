from django.contrib import admin

from vfse import models


@admin.register(models.Folder)
class FolerAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Document)
class DocumentAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Topic)
class TopicAdmin(admin.ModelAdmin):
    pass


@admin.register(models.RecentActivity)
class RecentActivityAdmin(admin.ModelAdmin):
    list_display = ("topic", "action")
    list_filter = ("topic", "user", "action")


@admin.register(models.WorkOrder)
class WorkOrderAdmin(admin.ModelAdmin):
    pass
