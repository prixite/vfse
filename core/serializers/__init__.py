import re

from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator

from core import models
from core.serializers import defaults


class OrganizationAppearanceSerializer(serializers.Serializer):
    sidebar_text = serializers.CharField()
    button_text = serializers.CharField()
    sidebar_color = serializers.CharField()
    primary_color = serializers.CharField()
    secondary_color = serializers.CharField()
    font_one = serializers.CharField()
    font_two = serializers.CharField()
    logo = serializers.URLField()
    banner = serializers.URLField()
    icon = serializers.URLField()


class MetaSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Site
        fields = ["id", "name", "address"]


class SiteSerializer(serializers.ModelSerializer):
    modalities = serializers.ListField(
        child=serializers.CharField(), allow_empty=True, read_only=True
    )
    connections = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Site
        fields = ["id", "name", "address", "modalities", "connections"]


class SiteCreateSerializer(SiteSerializer):
    id = serializers.IntegerField(allow_null=True, default=None)


class OrganizationSiteSerializer(serializers.ModelSerializer):
    # Make it write only to avoid nplusone error. This update method in base
    # class of DRF invalidates the prefetch cache.
    sites = SiteCreateSerializer(many=True, write_only=True)

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

    sites = MetaSiteSerializer(many=True, read_only=True)

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
    sites = MetaSiteSerializer(many=True, read_only=True)

    class Meta:
        model = models.Organization
        fields = [
            "id",
            "name",
            "appearance",
            "sites",
        ]


class HealthNetworkCreateSerializer(HealthNetworkSerializer):
    id = serializers.IntegerField(allow_null=True, default=None)


class OrganizationHealthNetworkSerializer(serializers.ModelSerializer):
    health_networks = HealthNetworkCreateSerializer(many=True, write_only=True)

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


class ModalitySerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        validators=[UniqueValidator(queryset=models.Modality.objects.all())]
    )

    class Meta:
        model = models.Modality
        fields = ["id", "name"]


class UserSerializer(serializers.ModelSerializer):
    modalities = serializers.ListField(
        child=serializers.CharField(max_length=32), read_only=True
    )
    health_networks = serializers.ListField(
        child=serializers.CharField(max_length=32), read_only=True
    )
    organizations = serializers.ListField(
        child=serializers.CharField(max_length=32), read_only=True
    )
    sites = serializers.ListField(
        child=serializers.CharField(max_length=32), read_only=True
    )
    image = serializers.CharField(source="profile.meta.profile_picture", read_only=True)
    phone = serializers.CharField(source="profile.phone", read_only=True)
    role = serializers.SlugRelatedField(
        source="memberships", slug_field="role", many=True, read_only=True
    )
    manager = serializers.CharField(read_only=True)

    class Meta:
        model = models.User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "username",
            "is_active",
            "health_networks",
            "modalities",
            "organizations",
            "phone",
            "role",
            "manager",
            "image",
            "sites",
        ]


class MetaSerialzer(serializers.Serializer):
    profile_picture = serializers.URLField()
    title = serializers.CharField(required=False)


class UpsertUserSerializer(serializers.Serializer):
    meta = MetaSerialzer(default=defaults.ProfileMetaDefault())
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField(
        validators=[
            UniqueValidator(
                queryset=models.User.objects.all().values_list("username"),
                message="Email already in use",
            )
        ],
    )
    phone = serializers.CharField()
    role = serializers.ChoiceField(
        choices=models.Role,
        required=True,
    )
    manager = serializers.PrimaryKeyRelatedField(queryset=models.User.objects.all())
    organization = serializers.PrimaryKeyRelatedField(
        queryset=models.Organization.objects.all()
    )
    sites = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=models.Site.objects.all(),
        required=False,
    )
    modalities = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=models.Modality.objects.all(),
        required=False,
    )
    fse_accessible = serializers.BooleanField()
    audit_enabled = serializers.BooleanField()
    can_leave_notes = serializers.BooleanField()
    view_only = serializers.BooleanField()
    is_one_time = serializers.BooleanField()
    documentation_url = serializers.BooleanField()

    def validate_phone(self, value):
        result = re.match(r"(?P<phone>\+1\d{10}$)", value)

        if not result:
            raise serializers.ValidationError(
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
                raise serializers.ValidationError(
                    "Some organizations are not accessible",
                    code="invalid",
                )
            return value
        return value


class OrganizationUpsertUserSerializer(serializers.ModelSerializer):
    memberships = UpsertUserSerializer(many=True, write_only=True)

    class Meta:
        model = models.Organization
        fields = ["id", "memberships"]


class UserEnableDisableSerializer(serializers.Serializer):
    users = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.User.objects.all()
    )

    def validate(self, attrs):
        if self.context["request"].user.is_superuser:
            return attrs

        if len(set(self.context["view"].get_queryset()) & set(attrs["users"])) != len(
            attrs["users"]
        ):
            raise serializers.ValidationError("Some users are not accessible")

        return attrs


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Manufacturer
        fields = ["name", "image"]


class ProductSerializer(serializers.ModelSerializer):
    manufacturer = ManufacturerSerializer()

    class Meta:
        model = models.Product
        fields = ["id", "name", "manufacturer"]


class DocumentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Documentation
        fields = ["id", "url"]


class ProductModelSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    modality = ModalitySerializer()
    documentation = DocumentationSerializer()
    name = serializers.SerializerMethodField()

    class Meta:
        model = models.ProductModel
        fields = ["id", "product", "model", "modality", "documentation", "name"]
        read_only_fields = ["product"]

    def get_name(self, obj):
        return f"{obj.product.manufacturer.name} - {obj.product.name} - {obj.model}"


class SystemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SystemImage
        fields = ["id", "image"]


class SystemConnectionOptions(serializers.Serializer):
    vfse = serializers.BooleanField(write_only=True)
    virtual_media_control = serializers.BooleanField()
    service_web_browser = serializers.BooleanField()
    ssh = serializers.BooleanField()


class SystemSerializer(serializers.ModelSerializer):
    his_ris_info = SystemInfoSerializer(default=defaults.HisInfoDefault())
    dicom_info = SystemInfoSerializer(default=defaults.DicomInfoDefault())
    mri_embedded_parameters = MriInfoSerializer(default=defaults.MriInfoDefault())
    connection_options = SystemConnectionOptions(
        default=defaults.ConnectionOptionDefault()
    )
    image_url = serializers.ReadOnlyField()
    documentation = serializers.ReadOnlyField()

    class Meta:
        model = models.System
        fields = [
            "id",
            "name",
            "site",
            "serial_number",
            "location_in_building",
            "system_contact_info",
            "grafana_link",
            "product_model",
            "image",
            "software_version",
            "asset_number",
            "ip_address",
            "local_ae_title",
            "his_ris_info",
            "dicom_info",
            "mri_embedded_parameters",
            "connection_options",
            "image_url",
            "documentation",
            "is_online",
            "last_successful_ping_at",
        ]
        validators = [
            UniqueTogetherValidator(
                queryset=models.System.objects.all(),
                fields=["name", "site"],
                message="System with given name for selected site already exists",
            )
        ]


class SystemNotesSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Note
        fields = ["author", "note", "created_at"]
        extra_kwargs = {"author": {"read_only": True}}


class ManufacturerImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ManufacturerImage
        fields = ["image"]


class SeatListSerializer(serializers.ModelSerializer):
    system = SystemSerializer()

    class Meta:
        model = models.Seat
        fields = ["system"]


class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Seat
        fields = ["system"]


class OrganizationSeatSeriazlier(serializers.ModelSerializer):
    seats = SeatSerializer(many=True)

    class Meta:
        model = models.Organization
        fields = ["seats"]

    def validate(self, attrs):
        if getattr(self.context["view"], "swagger_fake_view", False):
            # Short circuit this when openapi code is running.
            return attrs

        organization_pk = self.context["view"].kwargs["pk"]
        occupied_seats = models.Seat.objects.filter(
            organization_id=organization_pk
        ).count()
        if models.Organization.objects.get(
            id=organization_pk
        ).number_of_seats - occupied_seats < len(attrs["seats"]):
            raise serializers.ValidationError("Seats not available")
        return attrs


class UserRequestAcessSeriazlizer(UpsertUserSerializer):
    health_networks = serializers.PrimaryKeyRelatedField(
        queryset=models.Organization.objects.all(), many=True
    )

    def validate_organization(self, value):
        return value


class ProductCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = ["id", "name", "manufacturer"]

        validators = [
            UniqueTogetherValidator(
                queryset=models.Product.objects.all(),
                fields=["name", "manufacturer"],
                message="Product with given name under selected manufacturer exists",
            )
        ]


class ProductModelCreateSerializer(serializers.ModelSerializer):
    documentation = DocumentationSerializer()

    class Meta:
        model = models.ProductModel
        fields = ["id", "model", "documentation", "modality", "product"]

        validators = [
            UniqueTogetherValidator(
                queryset=models.ProductModel.objects.all(),
                fields=["product", "model"],
                message="Model with given name already exists for selected product",
            )
        ]

    @transaction.atomic
    def create(self, validated_data):
        documentation_data = validated_data.pop("documentation")
        return models.ProductModel.objects.create(
            **validated_data,
            documentation=models.Documentation.objects.create(**documentation_data),
        )
