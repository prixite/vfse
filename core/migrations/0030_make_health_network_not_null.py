# Generated by Django 3.2.8 on 2021-12-04 06:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0029_connect_site_directly_to_health_network"),
    ]

    operations = [
        migrations.AlterField(
            model_name="site",
            name="health_network",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sites",
                to="core.healthnetwork",
            ),
        ),
    ]
