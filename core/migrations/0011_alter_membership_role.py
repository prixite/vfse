# Generated by Django 3.2.8 on 2021-11-04 08:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0010_auto_20211104_0839"),
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
                    ("view-only", "View Only"),
                    ("one-time", "One Time"),
                    ("cryo", "Cryo"),
                    ("cryo-fse", "Cryo FSE"),
                    ("cryo-admin", "Cryo Admin"),
                ],
                default="fse",
                max_length=32,
            ),
        ),
    ]
