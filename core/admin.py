from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as CoreUserAdmin
from rest_framework.authtoken.admin import TokenAdmin

from core import forms, models

TokenAdmin.list_filter = (
    "user__is_request_user",
    "user__is_staff",
    "user__is_superuser",
    "user__is_active",
    "user__is_supermanager",
    "user__is_remote_user",
)


@admin.register(models.User)
class UserAdmin(CoreUserAdmin):
    list_display = (
        "username",
        "email",
    )
    list_filter = (
        "is_staff",
        "is_superuser",
        "is_active",
        "is_supermanager",
        "is_request_user",
        "is_remote_user",
    )
    fieldsets = CoreUserAdmin.fieldsets + (
        (
            "More Permissions",
            {
                "fields": (
                    "is_supermanager",
                    "is_request_user",
                    "is_remote_user",
                )
            },
        ),
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
        "organization_health_network",
        "role",
    )


@admin.register(models.Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "manager",
    )

    list_filter = (
        "user__is_remote_user",
        "user__is_staff",
        "user__is_supermanager",
        "user__is_active",
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
    list_display = ("organization", "name", "address")


@admin.register(models.Modality)
class ModalityAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.System)
class SystemAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "product_model",
        "site",
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


@admin.register(models.Manufacturer)
class ManufacturerAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "manufacturer",
        "name",
    )


@admin.register(models.ProductModel)
class ProductModelAdmin(admin.ModelAdmin):
    list_display = (
        "product",
        "model",
        "modality",
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


@admin.register(models.SystemImage)
class SystemImageAdmin(admin.ModelAdmin):
    list_display = ["image"]
    form = forms.ImageForm


@admin.register(models.ManufacturerImage)
class ManufacturerImageAdmin(admin.ModelAdmin):
    list_display = ["image"]
    form = forms.ImageForm


admin.site.register(models.OrganizationHealthNetwork)
admin.site.register(models.Documentation)


@admin.register(models.UserSystem)
class UserSystemAdmin(admin.ModelAdmin):
    list_display = ["user", "system"]


@admin.register(models.WebSshLog)
class WebSshAdmin(admin.ModelAdmin):
    list_display = ["system", "user", "log"]
    list_filter = ("system", "user")


@admin.register(models.RouterLocation)
class LocationAdmin(admin.ModelAdmin):
    list_display = ["system", "long", "lat"]
    list_filter = ("system",)
    readonly_fields = ["created_at"]
