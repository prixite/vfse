# Generated by Django 3.2.8 on 2021-11-03 12:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0008_auto_20211103_1013"),
    ]

    operations = [
        migrations.AlterField(
            model_name="site",
            name="organization_health_network",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="core.organizationhealthnetwork",
            ),
        ),
    ]
