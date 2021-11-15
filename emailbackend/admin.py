from django.contrib import admin

from emailbackend.models import Email


@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = (
        "email_to",
        "email_from",
        "subject",
    )
