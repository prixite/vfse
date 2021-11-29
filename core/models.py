from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class User(AbstractUser):
    # username is an email field. Use this instead of email attribute of user
    # for email address.
    username = models.EmailField(
        "username",
        unique=True,
        error_messages={
            "unique": "A user with that username already exists.",
        },
    )

    is_supermanager = models.BooleanField(default=False)

    def get_organizations(self, roles=None):
        queryset = Membership.objects.filter(user=self)
        if roles is not None:
            queryset = queryset.filter(role__in=roles)

        return queryset.values_list("organization")


class UserModality(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "User modalities"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "modality"], name="unique_user_modality"
            ),
        ]


class UserSite(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    site = models.ForeignKey("Site", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "site"], name="unique_user_site"),
        ]


class UserHealthNetwork(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    health_network = models.ForeignKey("HealthNetwork", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "health_network"], name="unique_user_health_network"
            ),
        ]


class Profile(models.Model):
    user = models.OneToOneField("User", on_delete=models.CASCADE)
    manager = models.ForeignKey(
        "User",
        on_delete=models.SET_NULL,
        related_name="+",
        null=True,
        blank=True,
    )
    mfa_enabled = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Organization(models.Model):
    name = models.CharField(max_length=32)
    logo = models.ImageField(upload_to="organization/logo/", null=True, blank=True)
    background_color = models.CharField(max_length=8, blank=True)
    banner = models.ImageField(upload_to="organization/banner/", null=True, blank=True)
    number_of_seats = models.PositiveIntegerField(
        null=True, blank=True, validators=[MaxValueValidator(200), MinValueValidator(0)]
    )
    is_default = models.BooleanField(default=False)
    parent = models.ForeignKey(
        "self",
        null=True,
        on_delete=models.SET_NULL,
        related_name="sub_organizations",
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["is_default"]),
        ]
        ordering = ["name"]

        constraints = [
            models.UniqueConstraint(
                fields=["name"],
                name="unique_organization_name",
            ),
        ]


class Membership(models.Model):
    class Role(models.TextChoices):
        FSE_ADMIN = "fse-admin", "FSE Admin"
        CUSTOMER_ADMIN = "customer-admin", "Customer Admin"
        USER_ADMIN = "user-admin", "User Admin"
        FSE = "fse", "Field Service Engineer"
        END_USER = "end-user", "End User"
        VIEW_ONLY = "view-only", "View Only"
        ONE_TIME = "one-time", "One Time"
        CRYO = "cryo", "Cryo"
        CRYO_FSE = "cryo-fse", "Cryo FSE"
        CRYO_ADMIN = "cryo-admin", "Cryo Admin"

    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="memberships"
    )
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
    role = models.CharField(max_length=32, choices=Role.choices, default=Role.FSE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "organization", "role"],
                name="unique_user_organization_role",
            ),
        ]


class OrganizationHealthNetwork(models.Model):
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
    health_network = models.ForeignKey("HealthNetwork", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "health_network"],
                name="unique_organization_health_network",
            ),
        ]


class Site(models.Model):
    organization_health_network = models.ForeignKey(
        "OrganizationHealthNetwork",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=32)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization_health_network", "name"],
                name="unique_organization_health_network_name",
            ),
        ]


class Modality(models.Model):
    name = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Modalities"
        constraints = [
            models.UniqueConstraint(fields=["name"], name="unique_modality_name"),
        ]


class System(models.Model):
    site = models.ForeignKey("Site", on_delete=models.CASCADE)
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    image = models.ForeignKey("SystemImage", on_delete=models.SET_NULL, null=True)
    software_version = models.CharField(max_length=32)
    asset_number = models.CharField(max_length=32)
    ip_address = models.GenericIPAddressField()
    local_ae_title = models.CharField(max_length=32)
    serial_number = models.CharField(max_length=32, blank=True, null=True)
    location_in_building = models.CharField(max_length=32, blank=True, null=True)
    system_contact_info = models.TextField(max_length=256, blank=True, null=True)
    documentation_link = models.URLField(blank=True, null=True)
    system_option = models.TextField(blank=True, null=True)
    connection_monitoring = models.BooleanField(default=False)
    other = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SystemDetail(models.Model):
    site = models.OneToOneField("System", on_delete=models.CASCADE)
    his_ris_info_ip = models.GenericIPAddressField(blank=True, null=True)
    his_ris_info_ae_title = models.CharField(max_length=32, blank=True, null=True)
    his_ris_info_title = models.CharField(max_length=32, blank=True, null=True)
    his_ris_info_port = models.IntegerField(
        null=True,
        blank=True,
        validators=[MaxValueValidator(99999), MinValueValidator(0)],
    )
    dicom_info_ip = models.GenericIPAddressField(blank=True, null=True)
    dicom_info_ae_title = models.CharField(max_length=32, blank=True, null=True)
    dicom_info_title = models.CharField(max_length=32, blank=True, null=True)
    dicom_info_port = models.IntegerField(
        null=True,
        blank=True,
        validators=[MaxValueValidator(99999), MinValueValidator(0)],
    )
    mri_embedded_parameters_helium = models.CharField(
        max_length=32, blank=True, null=True
    )
    mri_embedded_parameters_magnet_pressure = models.CharField(
        max_length=32, blank=True, null=True
    )


class SystemImage(models.Model):
    image = models.ImageField(upload_to="system-image/", default="", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class AuditTrail(models.Model):
    remote_login_session = models.ForeignKey(
        "RemoteLoginSession", on_delete=models.CASCADE
    )
    log = models.TextField()
    log_type = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class RemoteLoginSession(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    work_order = models.CharField(max_length=32)
    purchase_order = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class HealthNetwork(models.Model):
    name = models.CharField(max_length=32, unique=True)
    logo = models.ImageField(upload_to="health-network/logo/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name"], name="unique_health_network_name"),
        ]


class Manufacturer(models.Model):
    name = models.CharField(max_length=32)
    image = models.ForeignKey("ManufacturerImage", null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name"], name="unique_manufacturer_name"),
        ]


class ManufacturerImage(models.Model):
    image = models.ImageField(upload_to="manufacture/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ManufacturerModality(models.Model):
    manufacturer = models.ForeignKey("Manufacturer", on_delete=models.CASCADE)
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["manufacturer", "modality"], name="unique_manufacturer_modality"
            ),
        ]


class Product(models.Model):
    manufacturer_modality = models.ForeignKey(
        "ManufacturerModality", on_delete=models.CASCADE
    )
    name = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["manufacturer_modality", "name"],
                name="unique_manufacturer_modality_name",
            ),
        ]


class Documentation(models.Model):
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    documenation = models.FileField(upload_to="documentation/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Note(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    author = models.ForeignKey("User", on_delete=models.CASCADE)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Seat(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["system", "organization"], name="unique_system_organization"
            ),
        ]
