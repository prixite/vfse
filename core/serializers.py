import re

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from core import models


class OrganizationAppearanceDefault:
    def __call__(self):
        return {x: "#773CBD" for x in OrganizationAppearanceSerializer().data}


class DefaultOrganizationDefault:
    requires_context = True

    def __call__(self, serializer_field):
        return serializer_field.context["request"].user.get_default_organization()


class OrganizationAppearanceSerializer(serializers.Serializer):
    color_one = serializers.CharField()
    color_two = serializers.CharField()
    color_three = serializers.CharField()
    sidebar_color = serializers.CharField()
    primary_color = serializers.CharField()
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
            "parent",
        ]


class OrganizationHealthNetworkCreateSerializer(serializers.Serializer):
    health_networks = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.HealthNetwork.objects.all()
    )


class OrganizationChildrenSerializer(serializers.Serializer):
    children = serializers.ListField(child=serializers.IntegerField())

    def validate(self, attrs):
        user = self.context["request"].user
        if user.is_superuser or user.is_supermanager:
            return attrs

        if len(set(user.get_organizations()) & set(attrs["children"])) != len(
            attrs["children"]
        ):
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


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Site
        fields = ["id", "name", "address"]


class HealthNetworkSerializer(serializers.ModelSerializer):
    sites = SiteSerializer(many=True)

    class Meta:
        model = models.HealthNetwork
        fields = ["id", "name", "logo", "sites"]


class SystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.System
        fields = [
            "site",
            "product_model",
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
            "is_active",
        ]


class UpsertUserSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    role = serializers.ChoiceField(
        choices=models.Membership.Role, default=models.Membership.Role.FSE
    )
    manager = serializers.PrimaryKeyRelatedField(queryset=models.User.objects.all())
    organization = serializers.PrimaryKeyRelatedField(
        queryset=models.Organization.objects.all()
    )
    sites = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.Site.objects.all()
    )
    modalities = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.Modality.objects.all()
    )
    fse_accessible = serializers.BooleanField()
    audit_enabled = serializers.BooleanField()
    can_leave_notes = serializers.BooleanField()
    view_only = serializers.BooleanField()
    is_one_time = serializers.BooleanField()

    def validate_phone(self, value):
        result = re.match(r"(?P<phone>\+1\d{10}$)", value)

        if not result:
            raise ValidationError(
                "Invalid.id phone number",
                code="invalid",
            )
        return value

    def validate_organization(self, value):
        if not self.context["request"].user.is_superuser:
            managed_org = (
                models.Organization.objects.filter(
                    id__in=self.context["request"].user.get_organizations()
                )
                .filter(id=value.id)
                .exists()
            )
            if not managed_org:
                raise ValidationError(
                    "Some organizations are not accessible",
                    code="invalid",
                )
            return value
        return value


class UserDeactivateSerializer(serializers.Serializer):
    users = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.User.objects.all()
    )

    def validate(self, attrs):
        if self.context["request"].user.is_superuser:
            return attrs

        if len(set(self.context["view"].get_queryset()) & set(attrs["users"])) != len(
            attrs["users"]
        ):
            raise ValidationError("Some users are not accessible")

        return attrs


class ModalitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Modality
        fields = ["name"]
