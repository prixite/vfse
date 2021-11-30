from rest_framework import serializers

from core import models


class OrganizationAppearanceDefault:
    def __call__(self):
        return OrganizationApperanceSerializer().data


class OrganizationApperanceSerializer(serializers.Serializer):
    color_one = serializers.CharField()
    color_two = serializers.CharField()
    color_three = serializers.CharField()
    font_one = serializers.CharField()
    font_two = serializers.CharField()


class OrganizationSerializer(serializers.ModelSerializer):
    appearance = OrganizationApperanceSerializer(
        default=OrganizationAppearanceDefault()
    )

    class Meta:
        model = models.Organization
        fields = [
            "id",
            "name",
            "logo",
            "background_color",
            "banner",
            "number_of_seats",
            "is_default",
            "appearance",
        ]


class MeSerializer(serializers.ModelSerializer):
    flags = serializers.SerializerMethodField()

    class Meta:
        model = models.User
        fields = ["first_name", "last_name", "flags"]

    def get_flags(self, user):
        organization_flag = "organization"
        modality_flag = "modality"
        user_flag = "user"
        documentation_flag = "documentation"
        vfse_flag = "vfse"

        flags = set()
        if user.is_superuser:
            flags |= {
                organization_flag,
                modality_flag,
                user_flag,
                documentation_flag,
                vfse_flag,
            }

        return sorted(flags)


class HealthNetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.HealthNetwork
        fields = ["name", "logo"]


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Site
        fields = ["name", "address"]


class SystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.System
        fields = [
            "modality",
            "product",
            "image",
            "software_version",
            "asset_number",
            "ip_address",
            "local_ae_title",
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "username",
        ]
