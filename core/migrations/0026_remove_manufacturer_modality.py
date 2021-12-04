# Generated by Django 3.2.8 on 2021-12-04 04:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0025_remove_organization_background_color"),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name="product",
            name="unique_manufacturer_modality_name",
        ),
        migrations.RemoveField(
            model_name="product",
            name="manufacturer_modality",
        ),
        migrations.AlterField(
            model_name="product",
            name="name",
            field=models.CharField(max_length=32, unique=True),
        ),
        migrations.DeleteModel(
            name="ManufacturerModality",
        ),
    ]
