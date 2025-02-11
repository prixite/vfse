# Generated by Django 4.2 on 2023-05-08 01:50

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0099_alter_organization_number_of_seats"),
    ]

    operations = [
        migrations.AlterField(
            model_name="organization",
            name="number_of_seats",
            field=models.PositiveIntegerField(
                blank=True,
                null=True,
                validators=[
                    django.core.validators.MaxValueValidator(65536),
                    django.core.validators.MinValueValidator(0),
                ],
            ),
        ),
    ]
