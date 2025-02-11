# Generated by Django 4.1 on 2022-08-30 07:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0075_modality_show_dicom_modality_show_ris"),
    ]

    operations = [
        migrations.AlterField(
            model_name="productmodel",
            name="documentation",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="core.documentation",
            ),
        ),
    ]
