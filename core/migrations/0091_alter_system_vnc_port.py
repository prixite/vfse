# Generated by Django 4.1.6 on 2023-02-26 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0090_system_vnc_port"),
    ]

    operations = [
        migrations.AlterField(
            model_name="system",
            name="vnc_port",
            field=models.CharField(blank=True, default="5900", max_length=8, null=True),
        ),
    ]
