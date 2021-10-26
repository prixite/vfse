from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Profile(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    manager = models.ForeignKey("User", on_delete=models.CASCADE, related_name="+")


class Organization(models.Model):
    name = models.CharField(max_length=32)
    logo = models.FileField()
    number_of_seats = models.PositiveIntegerField(null=True, blank=True)


class Membership(models.Model):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super-admin", "Super Admin"
        SUPER_MANAGER = "super-manager", "Super Manager"
        FSE_ADMIN = "fse-admin", "FSE Admin"

    user = models.ForeignKey("User", on_delete=models.CASCADE)
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
    po_number = models.CharField(max_length=32)


class HealthNetwork(models.Model):
    name = models.CharField(max_length=32)
    logo = models.FileField()


class Manufacturer(models.Model):
    name = models.CharField(max_length=32)


class Product(models.Model):
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)
    manufacturer = models.ForeignKey("Manufacturer", on_delete=models.CASCADE)
    name = models.CharField(max_length=32)


class Documentation(models.Model):
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    documenation = models.FileField()


class UserModality(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    modality = models.ForeignKey("Modality", on_delete=models.CASCADE)


class UserSite(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    site = models.ForeignKey("Site", on_delete=models.CASCADE)


class UserHealthNetwork(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    health_network = models.ForeignKey("HealthNetwork", on_delete=models.CASCADE)


class Notes(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    author = models.ForeignKey("User", on_delete=models.CASCADE)
    note = models.TextField()


class Seat(models.Model):
    system = models.ForeignKey("System", on_delete=models.CASCADE)
    organization = models.ForeignKey("Organization", on_delete=models.CASCADE)
