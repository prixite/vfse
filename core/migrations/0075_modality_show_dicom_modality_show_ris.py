# Generated by Django 4.0.5 on 2022-07-04 06:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0074_system_ssh_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="modality",
            name="show_dicom",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="modality",
            name="show_ris",
            field=models.BooleanField(default=False),
        ),
    ]
