# Generated by Django 3.2.8 on 2021-11-26 05:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0020_organization_unique_organization_name"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="organization",
            options={"ordering": ["name"]},
        ),
    ]
