from django.contrib import admin

from vfse import models


@admin.register(models.Folder)
class FolerAdmin(admin.ModelAdmin):
    pass


@admin.register(models.Category)
class CategoryAdmin(admin.ModelAdmin):
    pass
