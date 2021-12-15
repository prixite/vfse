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

        return queryset.values_list("organization", flat=True)

    def get_default_organization(self):
        if self.is_superuser or self.is_supermanager:
            return Organization.objects.get(is_default=True)

        organizations = Organization.objects.filter(
            id__in=self.get_organizations(),
        )

        return (
            organizations.filter(
                parent__isnull=True,
            ).first()
            or organizations.first()
        )

    def get_managed_organizations(self):
        return self.get_organizations(roles=[Membership.Role.CUSTOMER_ADMIN])

    def get_organization_health_networks(self, organization_pk):
        accessible_health_networks = OrganizationHealthNetwork.objects.filter(
            organization=organization_pk,
        ).values_list("health_network")

        if not (self.is_superuser or self.is_supermanager):
            accessible_health_networks = accessible_health_networks.filter(
                organization__in=self.get_organizations(),
                health_network__in=self.health_networks.all().values_list(
                    "health_network"
                ),
            )

        return accessible_health_networks

    class Meta:
        ordering = ["-id"]


class UserModality(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="modalities"
    )
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
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="sites")
    site = models.ForeignKey("Site", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "site"], name="unique_user_site"),
        ]


class UserHealthNetwork(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="health_networks"
    )
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
    phone = models.CharField(max_length=15, default="")
    mfa_enabled = models.BooleanField(default=False)
    fse_accessible = models.BooleanField(default=False)
    audit_enabled = models.BooleanField(default=True)
    can_leave_notes = models.BooleanField(default=True)
    is_view_only = models.BooleanField(default=False)
    is_one_time = models.BooleanField(default=True)
    view_only = models.BooleanField(default=False)
    one_time_complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Organization(models.Model):
    name = models.CharField(max_length=32)
    logo = models.URLField(null=True, blank=True)
    banner = models.URLField(null=True, blank=True)
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
    appearance = models.JSONField(default=dict)
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

    def __str__(self) -> str:
        return self.name


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
    health_network = models.ForeignKey(
        "HealthNetwork",
        on_delete=models.CASCADE,
        related_name="sites",
    )
    name = models.CharField(max_length=32)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["health_network", "name"],
                name="unique_health_network_site_name",
            ),
        ]
        ordering = ["-id"]

    def __str__(self):
        return f"{self.name} - {self.address}"


class Modality(models.Model):
    name = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Modalities"
        constraints = [
            models.UniqueConstraint(fields=["name"], name="unique_modality_name"),
        ]
        ordering = ["-id"]

    def __str__(self):
        return self.name


class System(models.Model):
    name = models.CharField(max_length=50)
    site = models.ForeignKey("Site", on_delete=models.CASCADE)
    product_model = models.ForeignKey("ProductModel", on_delete=models.CASCADE)
    image = models.ForeignKey("SystemImage", on_delete=models.SET_NULL, null=True)
    software_version = models.CharField(max_length=32)
    asset_number = models.CharField(max_length=32)
    ip_address = models.GenericIPAddressField()
    local_ae_title = models.CharField(max_length=32)
    serial_number = models.CharField(max_length=32, blank=True, null=True)
    location_in_building = models.CharField(max_length=32, blank=True, null=True)
    system_contact_info = models.TextField(max_length=256, blank=True, null=True)
    system_option = models.TextField(blank=True, null=True)
    connection_monitoring = models.BooleanField(default=False)
    other = models.TextField(null=True, blank=True)

    his_ris_info = models.JSONField(default=dict)
    dicom_info = models.JSONField(default=dict)
    mri_embedded_parameters = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]


class SystemImage(models.Model):
    image = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]


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
    logo = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name"], name="unique_health_network_name"),
        ]
        ordering = ["-id"]

    def __str__(self):
        return self.name


class Manufacturer(models.Model):
    name = models.CharField(max_length=32, unique=True)
    image = models.ForeignKey("ManufacturerImage", null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["-id"]


class ManufacturerImage(models.Model):
    image = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]


class Product(models.Model):
    name = models.CharField(max_length=32)
    manufacturer = models.ForeignKey("Manufacturer", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["name", "manufacturer"],
                name="unique_product_name_manufacturer",
            ),
        ]

    def __str__(self):
        return self.name


class Documentation(models.Model):
    url = models.URLField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.url


class Note(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    author = models.ForeignKey("User", on_delete=models.CASCADE)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]


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
        ordering = ["-id"]


class ProductModel(models.Model):
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    model = models.CharField(max_length=50)
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)
    documentation = models.ForeignKey(
        "Documentation", null=True, on_delete=models.SET_NULL
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["product", "model"], name="unique_product_model"
            )
        ]
