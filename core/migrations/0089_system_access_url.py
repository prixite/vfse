# Generated by Django 4.1.6 on 2023-02-26 09:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0088_remove_system_vnc_url"),
    ]

    operations = [
        migrations.AddField(
            model_name="system",
            name="access_url",
            field=models.CharField(blank=True, max_length=512, null=True),
        ),
    ]
