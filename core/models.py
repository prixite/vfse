from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Q
from rest_framework.authtoken.models import Token


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
    LAMBDA_ADMIN = "lambda-admin", "Lambda Admin"


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

    @property
    def modalities(self):
        return sorted(
            Modality.objects.filter(
                id__in=self.usermodality_set.all().values_list("modality")
            ).values_list("name", flat=True)
        )

    @property
    def health_networks(self):
        return sorted(
            OrganizationHealthNetwork.objects.filter(
                id__in=self.userhealthnetwork_set.all().values_list(
                    "organization_health_network"
                )
            )
            .select_related("health_network")
            .values_list("health_network__name", flat=True)
        )

    @property
    def organizations(self):
        return self.get_organizations().values_list("organization__name", flat=True)

    @property
    def manager(self):
        return str(self.profile.manager.get_full_name())

    def get_initials(self):
        if any([self.first_name, self.last_name]):
            return " ".join([self.first_name[0], self.last_name[0]])
        return self.username[0]

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

        return organizations.first()

    def get_managed_organizations(self):
        return self.get_organizations(roles=[Role.CUSTOMER_ADMIN])

    def get_organization_health_networks(self, organization_pk):
        return OrganizationHealthNetwork.objects.filter(
            organization=organization_pk,
            organization__in=self.get_organizations().filter(
                organization__is_customer=True
            ),
            id__in=UserHealthNetwork.objects.filter(user=self).values_list(
                "organization_health_network", flat=True
            ),
        ).values_list("health_network")

    def get_sites(self):
        return UserSite.objects.filter(user=self).values_list("site", flat=True)

    def get_systems(self):
        return UserSystem.objects.filter(user=self).values_list("system")

    def get_organization_systems(self, organization_pk):
        return System.objects.filter(
            id__in=self.get_systems(),
            site__in=self.get_sites(),
        ).filter(
            Q(
                site__organization__in=self.get_organization_health_networks(
                    organization_pk
                )
            )
            | Q(site__organization=organization_pk),
        )

    def get_site_systems(self, site_pk):
        return System.objects.filter(
            id__in=self.get_systems(),
            site_id=site_pk,
            site__in=self.get_sites(),
        )

    class Meta:
        ordering = ["-id"]


class UserModality(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    modality = models.ForeignKey(
        "Modality", on_delete=models.CASCADE, related_name="modalities"
    )
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
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
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "site"], name="unique_user_site"),
        ]


class UserSystem(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "system"], name="unique_user_systems"
            ),
        ]


class UserHealthNetwork(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    organization_health_network = models.ForeignKey(
        "OrganizationHealthNetwork", on_delete=models.CASCADE
    )
    role = models.CharField(max_length=32, choices=Role.choices, default=Role.FSE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "organization_health_network"],
                name="unique_user_organization_health_network",
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
    meta = models.JSONField(default=dict)
    mfa_enabled = models.BooleanField(default=False)
    fse_accessible = models.BooleanField(default=False)
    audit_enabled = models.BooleanField(default=True)
    can_leave_notes = models.BooleanField(default=True)
    is_view_only = models.BooleanField(default=False)
    is_one_time = models.BooleanField(default=True)
    view_only = models.BooleanField(default=False)
    documentation_url = models.BooleanField(default=False)
    one_time_complete = models.BooleanField(default=False)
    is_lambda_user = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Organization(models.Model):
    name = models.CharField(max_length=32)
    is_customer = models.BooleanField(default=False)
    number_of_seats = models.PositiveIntegerField(
        null=True, blank=True, validators=[MaxValueValidator(200), MinValueValidator(0)]
    )
    is_default = models.BooleanField(default=False)
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

    def get_lambda_admin_token(self):
        user = Membership.objects.get(
            user__username=f"org-{self.id}-lambda-user",
            organization=self,
            role=Role.LAMBDA_ADMIN,
        ).user
        return Token.objects.get(user=user).key


class Membership(models.Model):
    user = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="memberships"
    )
    organization = models.ForeignKey(
        "Organization",
        on_delete=models.CASCADE,
        limit_choices_to={"is_customer": True},
        related_name="memberships",
    )
    under_review = models.BooleanField(default=False)
    role = models.CharField(max_length=32, choices=Role.choices, default=Role.FSE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "organization"],
                name="unique_user_organization",
            ),
        ]


class OrganizationHealthNetwork(models.Model):
    organization = models.ForeignKey(
        "Organization", on_delete=models.CASCADE, related_name="health_networks"
    )
    health_network = models.ForeignKey("Organization", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "health_network"],
                name="unique_organization_health_network",
            ),
        ]


class Site(models.Model):
    organization = models.ForeignKey(
        "Organization", on_delete=models.CASCADE, related_name="sites"
    )
    name = models.CharField(max_length=32)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["organization", "name"],
                name="unique_organization_site_name",
            ),
        ]
        ordering = ["-id"]

    def __str__(self):
        return f"{self.name} - {self.address}"

    @property
    def modalities(self):
        return sorted(set([s.product_model.modality.name for s in self.systems.all()]))


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
    site = models.ForeignKey("Site", on_delete=models.CASCADE, related_name="systems")
    product_model = models.ForeignKey("ProductModel", on_delete=models.CASCADE)
    image = models.ForeignKey("SystemImage", on_delete=models.SET_NULL, null=True)
    software_version = models.CharField(max_length=32)
    asset_number = models.CharField(max_length=32)
    ip_address = models.GenericIPAddressField()
    local_ae_title = models.CharField(max_length=32)
    serial_number = models.CharField(max_length=32, blank=True, null=True)
    location_in_building = models.CharField(max_length=32, blank=True, null=True)
    system_contact_info = models.TextField(max_length=256, blank=True, null=True)
    connection_monitoring = models.BooleanField(default=False)
    grafana_link = models.URLField()
    system_option = models.TextField(blank=True, null=True)
    other = models.TextField(null=True, blank=True)

    his_ris_info = models.JSONField(default=dict)
    dicom_info = models.JSONField(default=dict)
    mri_embedded_parameters = models.JSONField(default=dict)
    connection_options = models.JSONField(default=dict)
    is_online = models.BooleanField(default=False)
    last_successful_ping_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["name", "site"], name="unique_system"),
        ]
        ordering = ["-id"]

    @property
    def documentation(self):
        return self.product_model.documentation.url

    @property
    def image_url(self):
        return self.image.image


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
        ordering = ["-id"]

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
    organization = models.ForeignKey(
        "Organization", on_delete=models.CASCADE, related_name="seats"
    )
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
        ordering = ["-id"]
