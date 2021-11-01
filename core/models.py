from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    def get_organizations(self, roles=None):
        queryset = Membership.objects.filter(user=self)
        if roles is not None:
            queryset = queryset.filter(role__in=roles)

        return queryset.values_list("organization")


class UserModality(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)


class UserSite(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    site = models.ForeignKey("Site", on_delete=models.CASCADE)


class UserHealthNetwork(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    health_network = models.ForeignKey("HealthNetwork", on_delete=models.CASCADE)


class Profile(models.Model):
    user = models.OneToOneField("User", on_delete=models.CASCADE)
    manager = models.ForeignKey(
        "User", on_delete=models.SET_NULL, related_name="+", null=True
    )


class Organization(models.Model):
    name = models.CharField(max_length=32)
    logo = models.ImageField(null=True, blank=True)
    background_color = models.CharField(max_length=8, blank=True)
    banner = models.ImageField(null=True, blank=True)
    number_of_seats = models.PositiveIntegerField(null=True, blank=True)
    is_default = models.BooleanField(default=False)
    parent = models.ForeignKey(
        "self",
        null=True,
        on_delete=models.SET_NULL,
        related_name="sub_organizations",
        blank=True,
    )

    class Meta:
        indexes = [
            models.Index(fields=["is_default"]),
        ]


class Membership(models.Model):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super-admin", "Super Admin"
        SUPER_MANAGER = "super-manager", "Super Manager"
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
    role = models.CharField(max_length=32, choices=Role.choices)


class Site(models.Model):
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
    health_network = models.ForeignKey("HealthNetwork", on_delete=models.CASCADE)
    name = models.CharField(max_length=32)
    address = models.TextField()


class Modality(models.Model):
    name = models.CharField(max_length=32)


class System(models.Model):
    site = models.ForeignKey("Site", on_delete=models.CASCADE)
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    image = models.ForeignKey("SystemImage", on_delete=models.SET_NULL, null=True)
    software_version = models.CharField(max_length=32)
    asset_number = models.CharField(max_length=32)
    ip_address = models.GenericIPAddressField()
    local_ae_title = models.CharField(max_length=32)


class SystemImage(models.Model):
    image = models.ImageField()


class AuditTrail(models.Model):
    remote_login_session = models.ForeignKey(
        "RemoteLoginSession", on_delete=models.CASCADE
    )
    log = models.TextField()
    log_type = models.CharField(max_length=32)


class RemoteLoginSession(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    work_order = models.CharField(max_length=32)
    purchase_order = models.CharField(max_length=32)


class HealthNetwork(models.Model):
    name = models.CharField(max_length=32)
    logo = models.ImageField()


class Manufacturer(models.Model):
    name = models.CharField(max_length=32)
    image = models.ForeignKey("ManufacturerImage", null=True, on_delete=models.SET_NULL)


class ManufacturerImage(models.Model):
    image = models.ImageField()


class Product(models.Model):
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)
    manufacturer = models.ForeignKey("Manufacturer", on_delete=models.CASCADE)
    name = models.CharField(max_length=32)


class Documentation(models.Model):
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    documenation = models.FileField()


class Notes(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    author = models.ForeignKey("User", on_delete=models.CASCADE)
    note = models.TextField()


class Seat(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
