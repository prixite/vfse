# Generated by Django 4.1.5 on 2023-01-25 06:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0084_alter_manufacturer_name_alter_modality_name_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="system",
            name="vnc_ip",
            field=models.GenericIPAddressField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="system",
            name="vnc_password",
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
    ]
