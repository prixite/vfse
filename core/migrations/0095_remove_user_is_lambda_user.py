# Generated by Django 4.1.7 on 2023-04-06 11:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0094_usersystem_is_read_only"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="is_lambda_user",
        ),
    ]
