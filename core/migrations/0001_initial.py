# Generated by Django 3.2.8 on 2021-10-29 09:47

from django.conf import settings
import django.contrib.auth.models
import django.contrib.auth.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("password", models.CharField(max_length=128, verbose_name="password")),
                (
                    "last_login",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="last login"
                    ),
                ),
                (
                    "is_superuser",
                    models.BooleanField(
                        default=False,
                        help_text="Designates that this user has all permissions without explicitly assigning them.",  # noqa
                        verbose_name="superuser status",
                    ),
                ),
                (
                    "username",
                    models.CharField(
                        error_messages={
                            "unique": "A user with that username already exists."
                        },
                        help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",  # noqa
                        max_length=150,
                        unique=True,
                        validators=[
                            django.contrib.auth.validators.UnicodeUsernameValidator()
                        ],
                        verbose_name="username",
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="first name"
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        blank=True, max_length=150, verbose_name="last name"
                    ),
                ),
                (
                    "email",
                    models.EmailField(
                        blank=True, max_length=254, verbose_name="email address"
                    ),
                ),
                (
                    "is_staff",
                    models.BooleanField(
                        default=False,
                        help_text="Designates whether the user can log into this admin site.",  # noqa
                        verbose_name="staff status",
                    ),
                ),
                (
                    "is_active",
                    models.BooleanField(
                        default=True,
                        help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",  # noqa
                        verbose_name="active",
                    ),
                ),
                (
                    "date_joined",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="date joined"
                    ),
                ),
                (
                    "groups",
                    models.ManyToManyField(
                        blank=True,
                        help_text="The groups this user belongs to. A user will get all permissions granted to each of their groups.",  # noqa
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Group",
                        verbose_name="groups",
                    ),
                ),
                (
                    "user_permissions",
                    models.ManyToManyField(
                        blank=True,
                        help_text="Specific permissions for this user.",
                        related_name="user_set",
                        related_query_name="user",
                        to="auth.Permission",
                        verbose_name="user permissions",
                    ),
                ),
            ],
            options={
                "verbose_name": "user",
                "verbose_name_plural": "users",
                "abstract": False,
            },
            managers=[
                ("objects", django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name="HealthNetwork",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=32)),
                ("logo", models.ImageField(upload_to="")),
            ],
        ),
        migrations.CreateModel(
            name="Manufacturer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=32)),
            ],
        ),
        migrations.CreateModel(
            name="ManufacturerImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image", models.ImageField(upload_to="")),
            ],
        ),
        migrations.CreateModel(
            name="Modality",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=32)),
            ],
        ),
        migrations.CreateModel(
            name="Organization",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=32)),
                ("logo", models.ImageField(blank=True, null=True, upload_to="")),
                ("background_color", models.CharField(max_length=8)),
                ("banner", models.ImageField(blank=True, null=True, upload_to="")),
                ("number_of_seats", models.PositiveIntegerField(blank=True, null=True)),
                (
                    "parent",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="sub_organizations",
                        to="core.organization",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=32)),
                (
                    "manufacturer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="core.manufacturer",
                    ),
                ),
                (
                    "modality",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.modality"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Site",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=32)),
                ("address", models.TextField()),
                (
                    "health_network",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="core.healthnetwork",
                    ),
                ),
                (
                    "organization",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="core.organization",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="SystemImage",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("image", models.ImageField(upload_to="")),
            ],
        ),
        migrations.CreateModel(
            name="UserSite",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "site",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.site"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserModality",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "modality",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.modality"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserHealthNetwork",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "health_network",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="core.healthnetwork",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="System",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("software_version", models.CharField(max_length=32)),
                ("asset_number", models.CharField(max_length=32)),
                ("ip_address", models.GenericIPAddressField()),
                ("local_ae_title", models.CharField(max_length=32)),
                (
                    "image",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="core.systemimage",
                    ),
                ),
                (
                    "modality",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.modality"
                    ),
                ),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.product"
                    ),
                ),
                (
                    "site",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.site"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Seat",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "organization",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="core.organization",
                    ),
                ),
                (
                    "system",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.system"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="RemoteLoginSession",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("work_order", models.CharField(max_length=32)),
                ("purchase_order", models.CharField(max_length=32)),
                (
                    "system",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.system"
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Profile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "manager",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="+",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Notes",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("note", models.TextField()),
                (
                    "author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "system",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.system"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Membership",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[
                            ("super-admin", "Super Admin"),
                            ("super-manager", "Super Manager"),
                            ("fse-admin", "FSE Admin"),
                            ("customer-admin", "Customer Admin"),
                            ("user-admin", "User Admin"),
                            ("fse", "Field Service Engineer"),
                            ("end-user", "End User"),
                            ("view-only", "View Only"),
                            ("one-time", "One Time"),
                            ("cryo", "Cryo"),
                            ("cryo-fse", "Cryo FSE"),
                            ("cryo-admin", "Cryo Admin"),
                        ],
                        max_length=32,
                    ),
                ),
                (
                    "organization",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="core.organization",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="manufacturer",
            name="image",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="core.manufacturerimage",
            ),
        ),
        migrations.CreateModel(
            name="Documentation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("documenation", models.FileField(upload_to="")),
                (
                    "product",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.product"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="AuditTrail",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("log", models.TextField()),
                ("log_type", models.CharField(max_length=32)),
                (
                    "remote_login_session",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="core.remoteloginsession",
                    ),
                ),
            ],
        ),
    ]
