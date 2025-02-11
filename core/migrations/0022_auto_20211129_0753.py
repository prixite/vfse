# Generated by Django 3.2.8 on 2021-11-29 07:53

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0021_alter_organization_options"),
    ]

    operations = [
        migrations.AlterField(
            model_name="organization",
            name="number_of_seats",
            field=models.PositiveIntegerField(
                blank=True,
                null=True,
                validators=[
                    django.core.validators.MaxValueValidator(200),
                    django.core.validators.MinValueValidator(0),
                ],
            ),
        ),
        migrations.AlterField(
            model_name="systemdetail",
            name="dicom_info_port",
            field=models.IntegerField(
                blank=True,
                null=True,
                validators=[
                    django.core.validators.MaxValueValidator(99999),
                    django.core.validators.MinValueValidator(0),
                ],
            ),
        ),
        migrations.AlterField(
            model_name="systemdetail",
            name="his_ris_info_port",
            field=models.IntegerField(
                blank=True,
                null=True,
                validators=[
                    django.core.validators.MaxValueValidator(99999),
                    django.core.validators.MinValueValidator(0),
                ],
            ),
        ),
    ]
