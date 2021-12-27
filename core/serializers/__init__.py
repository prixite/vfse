import re

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from core import models
from core.serializers import defaults


class OrganizationAppearanceSerializer(serializers.Serializer):
    sidebar_text = serializers.CharField()
    button_text = serializers.CharField()
    sidebar_color = serializers.CharField()
    primary_color = serializers.CharField()
    font_one = serializers.CharField()
    font_two = serializers.CharField()
    logo = serializers.URLField()
    banner = serializers.URLField()
    icon = serializers.URLField()


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Site
        fields = ["id", "name", "address"]


class OrganizationSiteSerializer(serializers.ModelSerializer):
    sites = SiteSerializer(many=True)

    class Meta:
        model = models.Organization
        fields = ["id", "sites"]


class OrganizationSerializer(serializers.ModelSerializer):
    appearance = OrganizationAppearanceSerializer(
        default=defaults.OrganizationAppearanceDefault()
    )

    name = serializers.CharField(
        max_length=32,
        validators=[UniqueValidator(queryset=models.Organization.objects.all())],
    )

    sites = SiteSerializer(many=True, read_only=True)

    class Meta:
        model = models.Organization
        fields = [
            "id",
            "name",
            "number_of_seats",
            "appearance",
            "sites",
        ]


class MeSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(default=defaults.DefaultOrganizationDefault())
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
        appearance_flag = "appearance"

        if user.is_superuser:
            return sorted(
                {
                    organization_flag,
                    modality_flag,
                    user_flag,
                    documentation_flag,
                    vfse_flag,
                    appearance_flag,
                }
            )

        if user.is_supermanager:
            return {modality_flag}

        to_modules = {
            models.Role.FSE_ADMIN: {vfse_flag, modality_flag},
            models.Role.CUSTOMER_ADMIN: {vfse_flag, organization_flag, appearance_flag},
            models.Role.FSE_ADMIN: {vfse_flag, modality_flag},
            models.Role.CUSTOMER_ADMIN: {organization_flag, modality_flag},
            models.Role.USER_ADMIN: {user_flag},
            models.Role.FSE: {vfse_flag},
            models.Role.END_USER: {modality_flag},
            models.Role.VIEW_ONLY: {modality_flag},
        }

        flags = set()
        for membership in models.Membership.objects.filter(
            user=user,
            organization=user.get_default_organization(),
        ):
            flags |= to_modules[membership.role]

        return sorted(flags)


class HealthNetworkAppearanceSerializer(serializers.Serializer):
    logo = serializers.URLField()


class HealthNetworkSerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        max_length=32,
    )
    appearance = HealthNetworkAppearanceSerializer(
        default=defaults.HealthNetworkAppearanceDefault()
    )
    sites = SiteSerializer(many=True, read_only=True)

    class Meta:
        model = models.Organization
        fields = [
            "id",
            "name",
            "appearance",
            "sites",
        ]


class OrganizationHealthNetworkSerializer(serializers.ModelSerializer):
    health_networks = HealthNetworkSerializer(many=True, write_only=True)

    class Meta:
        model = models.Organization
        fields = ["id", "health_networks"]


class SystemInfoSerializer(serializers.Serializer):
    ip = serializers.IPAddressField()
    title = serializers.CharField()
    port = serializers.IntegerField()
    ae_title = serializers.CharField()


class MriInfoSerializer(serializers.Serializer):
    helium = serializers.CharField()
    magnet_pressure = serializers.CharField()


class SystemSerializer(serializers.ModelSerializer):
    his_ris_info = SystemInfoSerializer(default=defaults.HisInfoDefault())
    dicom_info = SystemInfoSerializer(default=defaults.DicomInfoDefault())
    mri_embedded_parameters = MriInfoSerializer(default=defaults.MriInfoDefault())

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
            "his_ris_info",
            "dicom_info",
            "mri_embedded_parameters",
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


class MetaSerialzer(serializers.Serializer):
    profile_picture = serializers.URLField()
    title = serializers.CharField()


class UpsertUserSerializer(serializers.Serializer):
    meta = MetaSerialzer(default=defaults.ProfileMetaDefault())
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    role = serializers.ChoiceField(choices=models.Role, default=models.Role.FSE)
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


class ProductModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductModel
        fields = ["id", "product", "modality", "documentation"]


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Manufacturer
        fields = ["name", "image"]


class SystemNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Note
        fields = ["system", "author", "note", "created_at"]


class SystemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SystemImage
        fields = ["image"]


class ManufacturerImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ManufacturerImage
        fields = ["image"]


class SystemSeatSeriazlier(serializers.Serializer):
    ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.System.objects.all()
    )

    def validate(self, attrs):
        if getattr(self.context["view"], "swagger_fake_view", False):
            # Short circuit this when openapi code is running.
            return attrs

        organization_pk = self.context["view"].kwargs["organization_pk"]
        occupied_seats = models.Seat.objects.filter(
            organization_id=organization_pk
        ).count()
        if models.Organization.objects.get(
            id=organization_pk
        ).number_of_seats - occupied_seats < len(attrs["ids"]):
            raise ValidationError("Seats not available")
        return attrs


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Seat
        fields = ["system", "organization"]


class UserRequestAcessSeriazlizer(UpsertUserSerializer):
    health_networks = serializers.PrimaryKeyRelatedField(
        queryset=models.Organization.objects.all(), many=True
    )

    def validate_organization(self, value):
        return value
