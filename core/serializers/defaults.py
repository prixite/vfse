from django.templatetags.static import static

from app import settings
from core import models


class OrganizationAppearanceDefault:
    def __call__(self):
        return {
            "sidebar_text": "#94989E",
            "button_text": "#FFFFFF",
            "sidebar_color": "#142139",
            "primary_color": "#773CBD",
            "secondary_color": "#EFE1FF",
            "font_one": "helvetica",
            "font_two": "calibri",
            "logo": "",
            "banner": "",
            "icon": "",
        }


class URLOrganizationDefault:
    requires_context = True

    def __call__(self, serializer_field):
        return models.Organization.objects.get(
            id=serializer_field.context["view"].kwargs["pk"]
        )


class HisInfoDefault:
    def __call__(self):
        return {
            "ip": "192.187.23.23",
            "title": "HIS System 1",
            "ae_title": "HS1",
            "port": 2000,
        }


class DicomInfoDefault:
    def __call__(self):
        return {
            "ip": "192.0.0.9",
            "title": "Dicom System 1",
            "ae_title": "dS1",
            "port": 2850,
        }


class MriInfoDefault:
    def __call__(self):
        return {
            "helium": "High",
            "magnet_pressure": "strong",
        }


class ProfileMetaDefault:
    def __call__(self):
        return {
            "profile_picture": f"{settings.DOMAIN_NAME}{static('assets/profile.png')}",
            "title": "",
            "location": "",
            "slack_link": "",
            "calender_link": "",
            "zoom_link": "",
        }


class HealthNetworkAppearanceDefault:
    def __call__(self):
        return {"logo": ""}


class ConnectionOptionDefault:
    requires_context = True

    def __call__(self, serializer_field):
        if serializer_field.instance is None:
            return None

        return {
            "vfse": False,
            "virtual_media_control": False,
            "service_web_browser": False,
            "ssh": False,
        }
