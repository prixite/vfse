# Generated by Django 3.2.8 on 2021-12-17 15:09

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0040_auto_20211217_1509"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userhealthnetwork",
            name="organization_health_network",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="core.organizationhealthnetwork",
            ),
        ),
    ]
