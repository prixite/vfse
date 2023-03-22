from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Count, Q
from django.db.models.query import Prefetch
from rest_framework.authtoken.models import Token


class Role(models.TextChoices):
    FSE_ADMIN = "fse-admin", "FSE Admin"
    CUSTOMER_ADMIN = "customer-admin", "Customer Admin"
    USER_ADMIN = "user-admin", "User Admin"
    FSE = "fse", "Field Service Engineer"
    END_USER = "end-user", "End User"
    CRYO = "cryo", "Cryo"
    CRYO_FSE = "cryo-fse", "Cryo FSE"
    CRYO_ADMIN = "cryo-admin", "Cryo Admin"


class ModalityType(models.TextChoices):
    MRI = "mri", "Magnetic resonance imaging"
    PET = "pet", "Positron emission tomography"
    RF = "rf", "Radio Frequency"
    BMD = "bmd", "Bone Densitometry"
    CR = "cr", "Computed Radiography"
    DX = "dx", "Digital Radiography"
    IVUS = "ivus", "Intravascular Ultrasound "
    MG = "mg", "Mammography"
    US = "us", "Ultrasound"
    MI = "mi", "Medical Imaging"
    MR = "mr", "Magnetic Resonance"
    CT = "ct", "Computed Tomography"


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
    # lambda user can access api from AWS Lambda functions
    is_lambda_user = models.BooleanField(default=False)
    # request user can access api from "Register Now" page.
    is_request_user = models.BooleanField(default=False)
    # Remote user can access certain APIs remotely, using the token
    is_remote_user = models.BooleanField(default=False)

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
        if not self.profile.manager:
            return None

        return {
            "name": str(self.profile.manager.get_full_name()),
            "email": self.profile.manager.username,
        }

    @property
    def sites(self):
        return self.get_sites().values_list("site__name", flat=True)

    @property
    def systems(self):
        return self.get_systems().values_list("system", flat=True)

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
            return Organization.objects.filter(is_default=True).first()

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
                Q(organization__is_customer=True) | Q(organization__is_default=True)
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
            id__in=self.systems,
            site__in=self.get_sites(),
            product_model__modality__in=self.usermodality_set.all().values_list(
                "modality"
            ),
        ).filter(
            Q(
                site__organization__in=self.get_organization_health_networks(
                    organization_pk
                )
            )
            | Q(site__organization=organization_pk),
        )

    def get_organization_sites(self, organization_pk):
        return Site.objects.filter(id__in=self.get_sites(),).filter(
            Q(organization__in=self.get_organization_health_networks(organization_pk))
            | Q(organization=organization_pk),
        )

    def get_organization_role(self, organization_pk):
        if self.is_superuser or self.is_supermanager:
            return ""

        return Membership.objects.get(
            user=self,
            organization=organization_pk,
        ).role

    def get_organization_flags(self, organization_pk):
        organization_flag = "organization"
        modality_flag = "modality"
        user_flag = "user"
        documentation_flag = "documentation"
        vfse_flag = "vfse"
        appearance_flag = "appearance"

        if self.is_superuser:
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

        if self.is_supermanager:
            return {modality_flag, organization_flag}

        to_modules = {
            Role.FSE_ADMIN: {vfse_flag, modality_flag},
            Role.CUSTOMER_ADMIN: {vfse_flag, organization_flag, appearance_flag},
            Role.FSE_ADMIN: {vfse_flag, modality_flag},
            Role.CUSTOMER_ADMIN: {organization_flag, modality_flag},
            Role.USER_ADMIN: {user_flag},
            Role.FSE: {vfse_flag},
            Role.END_USER: {modality_flag},
        }

        flags = set()
        for membership in Membership.objects.filter(
            user=self,
            organization=organization_pk,
        ):
            flags |= to_modules[membership.role]

        if self.profile.fse_accessible:
            flags.add(vfse_flag)
        return sorted(flags)

    def get_site_systems(self, site_pk):
        return System.objects.filter(
            id__in=self.get_systems(),
            site_id=site_pk,
            site__in=self.get_sites(),
        )

    def is_customer_admin(self, organization_pk):
        return self.get_organization_role(organization_pk) == Role.CUSTOMER_ADMIN

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
    user = models.ForeignKey("User", on_delete=models.CASCADE)
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
    phone = models.CharField(max_length=32, default="")
    meta = models.JSONField(default=dict)
    mfa_enabled = models.BooleanField(default=False)
    fse_accessible = models.BooleanField(default=False)
    audit_enabled = models.BooleanField(default=True)
    can_leave_notes = models.BooleanField(default=True)
    is_one_time = models.BooleanField(default=True)
    view_only = models.BooleanField(default=False)
    documentation_url = models.BooleanField(default=False)
    one_time_complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Organization(models.Model):
    name = models.CharField(max_length=64)
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

    @staticmethod
    def get_organization_health_networks(organization_pk):
        return OrganizationHealthNetwork.objects.filter(
            organization=organization_pk,
        ).values_list("health_network", flat=True)

    @classmethod
    def get_organization_sites(cls, organization_pk):
        return (
            Site.objects.filter(
                Q(
                    organization__in=cls.get_organization_health_networks(
                        organization_pk
                    )
                )
                | Q(organization=organization_pk),
            )
            .prefetch_related(
                Prefetch(
                    "systems",
                    queryset=System.objects.all().select_related(
                        "product_model__modality"
                    ),
                ),
            )
            .annotate(connections=Count("systems"))
        )


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
    name = models.CharField(max_length=64)
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
    name = models.CharField(max_length=64)
    group = models.CharField(
        max_length=5,
        choices=ModalityType.choices,
        unique=True,
        null=True,
    )
    show_ris = models.BooleanField(default=False)
    show_dicom = models.BooleanField(default=False)
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
    software_version = models.CharField(max_length=32, blank=True, null=True)
    asset_number = models.CharField(max_length=32, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    vnc_port = models.CharField(max_length=8, blank=True, null=True, default="5900")
    access_url = models.CharField(max_length=512, null=True, blank=True)
    local_ae_title = models.CharField(max_length=32, blank=True, null=True)
    serial_number = models.CharField(max_length=32, blank=True, null=True)
    location_in_building = models.CharField(max_length=32, blank=True, null=True)
    system_contact_info = models.TextField(max_length=256, blank=True, null=True)
    chatbot_content = models.TextField(null=True, blank=True)
    connection_monitoring = models.BooleanField(default=False)
    grafana_link = models.URLField(null=True, blank=True)
    system_option = models.TextField(blank=True, null=True)
    other = models.TextField(null=True, blank=True)
    his_ris_info = models.JSONField(default=dict)
    dicom_info = models.JSONField(default=dict)
    mri_embedded_parameters = models.JSONField(default=dict)
    connection_options = models.JSONField(default=dict)
    is_online = models.BooleanField(default=False)
    ssh_password = models.CharField(max_length=30, null=True, blank=True)
    ssh_user = models.CharField(max_length=25, default="root")
    last_successful_ping_at = models.DateTimeField(null=True, blank=True)
    service_page_url = models.CharField(max_length=2**9, null=True, blank=True)
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

    @property
    def vfse(self):
        return self.seats.filter(organization=self.site.organization).exists()


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
    name = models.CharField(max_length=64, unique=True)
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
    name = models.CharField(max_length=64)
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


class RouterLocation(models.Model):
    long = models.DecimalField(max_digits=11, decimal_places=8)
    lat = models.DecimalField(max_digits=10, decimal_places=8)
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Seat(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE, related_name="seats")
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
    product = models.ForeignKey(
        "Product", on_delete=models.CASCADE, related_name="product_models"
    )
    model = models.CharField(max_length=50)
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)
    documentation = models.ForeignKey(
        "Documentation", null=True, blank=True, on_delete=models.SET_NULL
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


class WebSshLog(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    log = models.CharField(max_length=32)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
