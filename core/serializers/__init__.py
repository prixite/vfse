import re
from smtplib import SMTPException

from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.db import transaction
from django.db.models import Q
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator, UniqueValidator

from core import models
from core.serializers import defaults
from core.utils import url_regex


class OrganizationAppearanceSerializer(serializers.Serializer):
    sidebar_text = serializers.CharField(default="")
    button_text = serializers.CharField(default="")
    sidebar_color = serializers.CharField(default="")
    primary_color = serializers.CharField(default="")
    secondary_color = serializers.CharField(default="")
    font_one = serializers.CharField(default="")
    font_two = serializers.CharField(default="")
    logo = serializers.URLField(default="")
    banner = serializers.URLField(default="")
    icon = serializers.URLField(default="")


class UserSystemSerializer(serializers.Serializer):
    system = serializers.IntegerField()
    is_read_only = serializers.BooleanField(default=True)


class MetaSiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Site
        fields = ["id", "name", "address"]

    def validate(self, attrs):
        if models.Site.objects.filter(
            name=attrs["name"], organization=self.context["view"].kwargs["pk"]
        ).exists():
            raise serializers.ValidationError(
                "Site with given in name in selected organization already exists"
            )
        return attrs


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

    def validate_name(self, value):
        duplicate = models.Organization.objects.filter(name=value)
        organization = True
        if self.instance:
            duplicate = duplicate.exclude(id=self.instance.id)
            organization = self.instance.is_customer or self.instance.is_default

        if duplicate.exists() and not organization:
            raise serializers.ValidationError("Health network name must be unique")
        elif duplicate.exists() and organization:
            raise serializers.ValidationError("Organization name must be unique")
        else:
            return value


class MetaSerialzer(serializers.Serializer):
    profile_picture = serializers.URLField(required=False)
    title = serializers.CharField(required=False)
    location = serializers.CharField(required=False, default="", allow_blank=True)
    slack_link = serializers.CharField(required=False, default="", allow_blank=True)
    calender_link = serializers.CharField(required=False, default="", allow_blank=True)
    zoom_link = serializers.CharField(required=False, default="", allow_blank=True)

    def validate_slack_link(self, value):
        if value:
            result = re.match(
                url_regex,
                value,
            )
            if not result:
                raise serializers.ValidationError(
                    "Enter a valid URL.",
                    code="invalid",
                )
        return value

    def validate_calender_link(self, value):
        if value:
            result = re.match(
                url_regex,
                value,
            )
            if not result:
                raise serializers.ValidationError(
                    "Enter a valid URL.",
                    code="invalid",
                )
        return value

    def validate_zoom_link(self, value):
        if value:
            result = re.match(
                url_regex,
                value,
            )
            if not result:
                raise serializers.ValidationError(
                    "Enter a valid URL.",
                    code="invalid",
                )
        return value


class MeUpdateSerializer(serializers.ModelSerializer):
    meta = MetaSerialzer(default=defaults.ProfileMetaDefault(), required=False)

    class Meta:
        model = models.User
        fields = ["first_name", "last_name", "meta"]


class MeSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(default=defaults.URLOrganizationDefault())
    flags = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    profile_picture = serializers.URLField(source="profile.meta.profile_picture")
    location = serializers.CharField(source="profile.meta.location")
    slack_link = serializers.URLField(source="profile.meta.slack_link")
    calender_link = serializers.URLField(source="profile.meta.calender_link")
    zoom_link = serializers.URLField(source="profile.meta.zoom_link")
    can_leave_notes = serializers.BooleanField(source="profile.can_leave_notes")
    fse_accessible = serializers.BooleanField(source="profile.fse_accessible")
    documentation_url = serializers.BooleanField(source="profile.documentation_url")
    view_only = serializers.BooleanField(source="profile.view_only")
    audit_enabled = serializers.BooleanField(source="profile.audit_enabled")

    class Meta:
        model = models.User
        fields = [
            "id",
            "first_name",
            "last_name",
            "flags",
            "organization",
            "role",
            "profile_picture",
            "is_superuser",
            "can_leave_notes",
            "fse_accessible",
            "documentation_url",
            "view_only",
            "location",
            "slack_link",
            "calender_link",
            "email",
            "zoom_link",
            "audit_enabled",
        ]

    def get_role(self, obj):
        user = self.context["view"].request.user
        return user.get_organization_role(self.context["view"].kwargs["pk"])

    def get_flags(self, user):
        user = self.context["view"].request.user
        return user.get_organization_flags(self.context["view"].kwargs["pk"])


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

    def validate(self, attrs):
        if (
            "id" not in attrs
            and models.Organization.objects.filter(name=attrs["name"]).exists()
        ):
            raise serializers.ValidationError("Health Network name must be unique")
        return attrs


class HealthNetworkCreateSerializer(HealthNetworkSerializer):
    id = serializers.IntegerField(allow_null=True, default=None)


class OrganizationHealthNetworkSerializer(serializers.ModelSerializer):
    health_networks = HealthNetworkCreateSerializer(many=True, write_only=True)

    class Meta:
        model = models.Organization
        fields = ["id", "health_networks"]


class SystemInfoSerializer(serializers.Serializer):
    ip = serializers.IPAddressField(required=False, allow_blank=True)
    title = serializers.CharField(required=False, allow_blank=True)
    port = serializers.IntegerField(required=False, allow_null=True)
    ae_title = serializers.CharField(required=False, allow_blank=True)


class MriInfoSerializer(serializers.Serializer):
    helium = serializers.CharField(required=False, allow_blank=True)
    magnet_pressure = serializers.CharField(required=False, allow_blank=True)


class ModalitySerializer(serializers.ModelSerializer):
    name = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=models.Modality.objects.all(),
                message="Modality name must be unique",
            )
        ]
    )

    class Meta:
        model = models.Modality
        fields = [
            "id",
            "name",
            "group",
            "show_ris",
            "show_dicom",
        ]


class ManagerMetaSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField()


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
    systems = serializers.ListField(child=UserSystemSerializer(), read_only=True)
    image = serializers.CharField(source="profile.meta.profile_picture", read_only=True)
    location = serializers.CharField(source="profile.meta.location", read_only=True)
    slack_link = serializers.CharField(source="profile.meta.slack_link", read_only=True)
    calender_link = serializers.CharField(
        source="profile.meta.calender_link", read_only=True
    )
    zoom_link = serializers.CharField(source="profile.meta.zoom_link", read_only=True)
    phone = serializers.CharField(source="profile.phone", read_only=True)
    role = serializers.SlugRelatedField(
        source="memberships", slug_field="role", many=True, read_only=True
    )
    manager = ManagerMetaSerializer(read_only=True)
    documentation_url = serializers.BooleanField(
        source="profile.documentation_url", read_only=True
    )
    fse_accessible = serializers.BooleanField(
        source="profile.fse_accessible", read_only=True
    )
    audit_enabled = serializers.BooleanField(
        source="profile.audit_enabled", read_only=True
    )
    can_leave_notes = serializers.BooleanField(
        source="profile.can_leave_notes", read_only=True
    )
    is_one_time = serializers.BooleanField(source="profile.is_one_time", read_only=True)
    view_only = serializers.BooleanField(source="profile.view_only", read_only=True)

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
            "fse_accessible",
            "audit_enabled",
            "can_leave_notes",
            "view_only",
            "is_one_time",
            "documentation_url",
            "role",
            "manager",
            "image",
            "location",
            "slack_link",
            "calender_link",
            "zoom_link",
            "sites",
            "systems",
        ]


class UpsertUserPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=8, required=True)
    old_password = serializers.CharField()

    def validate(self, data):
        old_password = data["old_password"]
        password = data["password"]
        if not (
            self.context["request"].user.check_password(old_password)
            and password != old_password
        ):
            raise serializers.ValidationError(
                "Password does not match and new password should not match to old password."  # noqa
            )
        return data


class GeneralUpsertUserSerializer(serializers.Serializer):
    meta = MetaSerialzer(default=defaults.ProfileMetaDefault())
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField()
    role = serializers.ChoiceField(
        choices=models.Role,
        required=True,
    )
    manager = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(), required=False
    )
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
        result = re.match(r"(?P<phUpsertUserSerializerone>\+1\d{10}$)", value)

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

    def validate(self, data):
        user_query = models.User.objects.filter(username=data["email"])
        if "pk" in self.context["view"].kwargs:
            user_query = user_query.exclude(id=self.context["view"].kwargs["pk"])

        if user_query.exists():
            raise serializers.ValidationError("Email already exists")
        return data


class UpsertUserSerializer(GeneralUpsertUserSerializer):
    systems = serializers.ListField(child=UserSystemSerializer())


class OrganizationUpsertUserSerializer(serializers.ModelSerializer):
    memberships = UpsertUserSerializer(many=True, write_only=True)

    class Meta:
        model = models.Organization
        fields = ["id", "memberships"]

    def create(self, validated_data):
        usernames = [item["email"] for item in validated_data["memberships"]]
        opts = {
            "use_https": self.context["request"].is_secure(),
            "token_generator": default_token_generator,
            "email_template_name": "core/emails/password_reset_email.txt",
            "html_email_template_name": "core/emails/password_reset_email.html",
            "subject_template_name": "registration/password_reset_subject.txt",
            "request": self.context["request"],
        }
        for email in usernames:
            try:
                form = PasswordResetForm(data={"email": email})
                form.is_valid()
                form.save(**opts)
            except SMTPException:
                raise serializers.ValidationError(
                    "Failed to Send Email. Please Try again"
                )

        return usernames


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
        fields = ["id", "name", "image"]


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

    class Meta:
        model = models.ProductModel
        fields = ["id", "product", "model", "modality", "documentation"]
        read_only_fields = ["product"]


class SystemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SystemImage
        fields = ["id", "image"]


class SystemConnectionOptions(serializers.Serializer):
    vfse = serializers.BooleanField()
    virtual_media_control = serializers.BooleanField(
        source="connection_options.virtual_media_control"
    )
    service_web_browser = serializers.BooleanField(
        source="connection_options.service_web_browser"
    )
    ssh = serializers.BooleanField(source="connection_options.ssh")


class SystemVncUrlSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.System
        fields = ["id", "vnc_url"]


class SystemVncSerializer(serializers.Serializer):
    organization = serializers.IntegerField(write_only=True, required=True)
    system = serializers.IntegerField(write_only=True, required=True)
    username = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True)


class SystemSerializer(serializers.ModelSerializer):
    his_ris_info = SystemInfoSerializer(default=defaults.HisInfoDefault())
    dicom_info = SystemInfoSerializer(default=defaults.DicomInfoDefault())
    mri_embedded_parameters = MriInfoSerializer(default=defaults.MriInfoDefault())
    connection_options = SystemConnectionOptions(
        source="*",
        default=defaults.ConnectionOptionDefault(),
    )

    image_url = serializers.ReadOnlyField()
    documentation = serializers.ReadOnlyField()
    product_model_detail = ProductModelSerializer(
        source="product_model", read_only=True
    )
    ip_address = serializers.IPAddressField(
        allow_blank=True, allow_null=True, required=False
    )
    ssh_password = serializers.CharField(
        write_only=True, allow_blank=True, allow_null=True, required=False
    )
    telnet_password = serializers.CharField(
        write_only=True, allow_blank=True, allow_null=True, required=False
    )

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
            "product_model_detail",
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
            "vnc_port",
            "service_page_url",
            "ssh_user",
            "ssh_password",
            "telnet_username",
            "telnet_password",
        ]
        validators = [
            UniqueTogetherValidator(
                queryset=models.System.objects.all(),
                fields=["name", "site"],
                message="System with given name for selected site already exists",
            )
        ]

    @transaction.atomic
    def create(self, validated_data):
        add_to_vfse = validated_data.pop("vfse")
        system = super().create(validated_data)
        seat_serializer = OrganizationSeatSeriazlier(
            data={"seats": [{"system": system.id}]},
            context={"view": self.context["view"]},
        )
        if add_to_vfse and seat_serializer.is_valid(raise_exception=True):
            models.Seat.objects.create(
                system=system, organization_id=self.context["view"].kwargs["pk"]
            )
        return system

    @transaction.atomic
    def update(self, instance, validated_data):
        if "vfse" in validated_data:
            add_to_vfse = validated_data.pop("vfse")
            validated_data["connection_options"]["vfse"] = add_to_vfse
            if instance.vfse and not add_to_vfse:
                models.Seat.objects.filter(
                    system=instance, organization=instance.site.organization
                ).delete()
            elif not instance.vfse and add_to_vfse:
                models.Seat.objects.create(
                    system=instance, organization=instance.site.organization
                )

        if not validated_data.get("ssh_password"):
            validated_data["ssh_password"] = instance.ssh_password

        if not validated_data.get("telnet_password"):
            validated_data["telnet_password"] = instance.telnet_password

        return super().update(instance, validated_data)


class SystemNotesSerializer(serializers.ModelSerializer):
    author_image = serializers.URLField(
        source="author.profile.meta.profile_picture", read_only=True
    )
    author_full_name = serializers.CharField(
        source="author.get_full_name", read_only=True
    )

    class Meta:
        model = models.Note
        fields = [
            "id",
            "author",
            "note",
            "created_at",
            "author_image",
            "author_full_name",
        ]


class NoteSerialier(serializers.ModelSerializer):
    class Meta:
        model = models.Note
        fields = ["id", "note"]


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
        if models.Seat.objects.filter(
            system__in=[item.get("system") for item in attrs["seats"]],
            organization_id=organization_pk,
        ).exists():
            raise serializers.ValidationError(
                "Seat for a selected system in current organization already exists"
            )

        occupied_seats = models.Seat.objects.filter(
            organization_id=organization_pk
        ).count()
        try:
            current_organization = models.Organization.objects.get(
                Q(is_customer=True) | Q(is_default=True),
                id=organization_pk,
            )
        except models.Organization.DoesNotExist:
            raise serializers.ValidationError(
                "Invalid selection, select customer organization, not health network"
            )
        if (
            current_organization.number_of_seats
            and current_organization.number_of_seats - occupied_seats
            < len(attrs["seats"])
        ):
            raise serializers.ValidationError("Seats not available")
        return attrs


class UserRequestAccessSerializer(GeneralUpsertUserSerializer):
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

    @transaction.atomic
    def update(self, instance, validated_data):
        if "documentation" in validated_data:
            documentation = validated_data.pop("documentation")
            instance.documentation.url = documentation.get("url")
            instance.documentation.save()
        return super().update(instance, validated_data)


class HealthNetworkListSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Organization
        fields = ["id", "name"]


class RoleSerializer(serializers.Serializer):
    value = serializers.CharField()
    title = serializers.CharField()


class InfluxSystemsSerializer(serializers.Serializer):
    systems = serializers.PrimaryKeyRelatedField(
        many=True, queryset=models.System.objects.all()
    )


class SystemAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.System
        fields = [
            "name",
            "ip_address",
            "ssh_password",
            "ssh_user",
        ]


class RouterLocationSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="system.name", read_only=True)

    class Meta:
        model = models.RouterLocation
        fields = ["system", "long", "lat", "name"]


class ProfileMetaSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="get_full_name", read_only=True)
    image = serializers.URLField(source="profile.meta.profile_picture", read_only=True)

    class Meta:
        model = models.User
        fields = ["id", "name", "image"]


class SystemMetaSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()

    class Meta:
        model = models.System
        fields = ["name", "image_url"]


class WebSshLogSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=models.User.objects.all(),  # Or User.objects.filter(active=True)
        required=False,
        allow_null=True,
        default=serializers.CurrentUserDefault(),
    )

    class Meta:
        model = models.WebSshLog
        fields = ["system", "user", "log"]

    def validate(self, attrs):
        if not attrs["user"].profile.audit_enabled:
            raise serializers.ValidationError(
                {"audit_enabled": "Please audit_enabled from your profile to log ssh."}
            )

        return attrs
