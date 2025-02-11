# Generated by Django 3.2.8 on 2021-12-23 23:15

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0046_auto_20211223_1258"),
    ]

    operations = [
        migrations.AlterField(
            model_name="organizationhealthnetwork",
            name="health_network",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, to="core.organization"
            ),
        ),
        migrations.AlterField(
            model_name="organizationhealthnetwork",
            name="organization",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="health_networks",
                to="core.organization",
            ),
        ),
    ]
