from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from core import models


class OrganizationAppearanceDefault:
    def __call__(self):
        return {x: "#FFF" for x in OrganizationAppearanceSerializer().data}


class DefaultOrganizationDefault:
    requires_context = True

    def __call__(self, serializer_field):
        return serializer_field.context["request"].user.get_default_organization()


class OrganizationAppearanceSerializer(serializers.Serializer):
    color_one = serializers.CharField()
    color_two = serializers.CharField()
    color_three = serializers.CharField()
    font_one = serializers.CharField()
    font_two = serializers.CharField()


class OrganizationSerializer(serializers.ModelSerializer):
    appearance = OrganizationAppearanceSerializer(
        default=OrganizationAppearanceDefault()
    )

    name = serializers.CharField(
        max_length=32,
        validators=[UniqueValidator(queryset=models.Organization.objects.all())],
    )

    class Meta:
        model = models.Organization
        fields = [
            "id",
            "name",
            "logo",
            "banner",
            "number_of_seats",
            "is_default",
            "appearance",
            "parent"
        ]


class OrganizationChildrenSeriazler(serializers.Serializer):
    children = serializers.ListField(child=serializers.IntegerField())

    def validate(self, attrs):
        if self.context["view"].get_user_organization().filter(
            id__in=attrs["children"]
        ).count() != len(attrs["children"]):
            raise ValidationError("Some Organizations are not accessible")
        return attrs


class MeSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(default=DefaultOrganizationDefault())
    flags = serializers.SerializerMethodField()

    class Meta:
        model = models.User
        fields = ["first_name", "last_name", "flags", "organization"]

    def get_flags(self, user):
        organization_flag = "organization"
        modality_flag = "modality"
        user_flag = "user"
        documentation_flag = "documentation"
        vfse_flag = "vfse"

        if user.is_superuser:
            return sorted(
                {
                    organization_flag,
                    modality_flag,
                    user_flag,
                    documentation_flag,
                    vfse_flag,
                }
            )

        if user.is_supermanager:
            return {
                modality_flag,
            }

        Role = models.Membership.Role
        to_modules = {
            Role.FSE_ADMIN: {vfse_flag, modality_flag},
            Role.CUSTOMER_ADMIN: {vfse_flag, organization_flag},
            Role.FSE_ADMIN: {vfse_flag, modality_flag},
            Role.CUSTOMER_ADMIN: {organization_flag, modality_flag},
            Role.USER_ADMIN: {user_flag},
            Role.FSE: {vfse_flag},
            Role.END_USER: {modality_flag},
            Role.VIEW_ONLY: {modality_flag},
        }

        flags = set()
        for membership in models.Membership.objects.filter(
            user=user,
            organization=user.get_default_organization(),
        ):
            flags |= to_modules[membership.role]

        return sorted(flags)


class HealthNetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.HealthNetwork
        fields = ["id", "name", "logo"]


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
