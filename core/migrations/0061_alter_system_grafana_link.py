# Generated by Django 4.0 on 2022-01-27 08:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0060_profile_documentation_url"),
    ]

    operations = [
        migrations.AlterField(
            model_name="system",
            name="grafana_link",
            field=models.URLField(blank=True, null=True),
        ),
    ]
