# Generated by Django 3.2.8 on 2021-11-29 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0022_auto_20211129_0753"),
    ]

    operations = [
        migrations.AddField(
            model_name="organization",
            name="appearance",
            field=models.JSONField(default=dict),
        ),
    ]
