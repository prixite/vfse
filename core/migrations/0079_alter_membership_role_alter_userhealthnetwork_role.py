# Generated by Django 4.1.1 on 2022-09-23 12:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0078_alter_membership_role_alter_userhealthnetwork_role"),
    ]

    operations = [
        migrations.AlterField(
            model_name="membership",
            name="role",
            field=models.CharField(
                choices=[
                    ("fse-admin", "FSE Admin"),
                    ("customer-admin", "Customer Admin"),
                    ("user-admin", "User Admin"),
                    ("fse", "Field Service Engineer"),
                    ("end-user", "End User"),
                    ("cryo", "Cryo"),
                    ("cryo-fse", "Cryo FSE"),
                    ("cryo-admin", "Cryo Admin"),
                ],
                default="fse",
                max_length=32,
            ),
        ),
        migrations.AlterField(
            model_name="userhealthnetwork",
            name="role",
            field=models.CharField(
                choices=[
                    ("fse-admin", "FSE Admin"),
                    ("customer-admin", "Customer Admin"),
                    ("user-admin", "User Admin"),
                    ("fse", "Field Service Engineer"),
                    ("end-user", "End User"),
                    ("cryo", "Cryo"),
                    ("cryo-fse", "Cryo FSE"),
                    ("cryo-admin", "Cryo Admin"),
                ],
                default="fse",
                max_length=32,
            ),
        ),
    ]
