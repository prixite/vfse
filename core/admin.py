from django.contrib import admin

from core.models import Organization


class OrganizationAdmin(admin.ModelAdmin):
    list_display = ("name",)


admin.site.register(Organization, OrganizationAdmin)
