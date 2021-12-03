from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as CoreUserAdmin

from core import models
from core.models import ManufacturerImage, SystemImage


@admin.register(models.User)
class UserAdmin(CoreUserAdmin):
    list_display = (
        "username",
        "email",
    )


@admin.register(models.UserModality)
class UserModalityAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "modality",
    )


@admin.register(models.UserSite)
class UserSiteAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "site",
    )


@admin.register(models.UserHealthNetwork)
class UserHealthNetworkAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "health_network",
    )


@admin.register(models.Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "manager",
    )


@admin.register(models.Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "organization",
        "role",
    )


@admin.register(models.Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ("organization_health_network", "name", "address")


@admin.register(models.Modality)
class ModalityAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.System)
class SystemAdmin(admin.ModelAdmin):
    list_display = (
        "modality",
        "product",
        "ip_address",
    )


@admin.register(models.AuditTrail)
class AuditTrailAdmin(admin.ModelAdmin):
    list_display = (
        "log",
        "log_type",
    )


@admin.register(models.RemoteLoginSession)
class RemoteLoginSessionAdmin(admin.ModelAdmin):
    list_display = (
        "system",
        "user",
        "work_order",
        "purchase_order",
    )


@admin.register(models.HealthNetwork)
class HealthNetworkAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.Manufacturer)
class ManufacturerAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "get_manufacturer",
        "get_modality",
        "name",
    )

    def get_manufacturer(self, obj):
        return obj.manufacturer_modality.manufacturer

    def get_modality(self, obj):
        return obj.manufacturer_modality.modality


@admin.register(models.Documentation)
class DocumentationAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "documenation",
    )


@admin.register(models.Note)
class NotesAdmin(admin.ModelAdmin):
    list_display = (
        "system",
        "author",
        "note",
    )


@admin.register(models.Seat)
class SeatAdmin(admin.ModelAdmin):
    list_display = (
        "system",
        "organization",
    )


admin.site.register(SystemImage)
admin.site.register(ManufacturerImage)
admin.site.register(models.OrganizationHealthNetwork)