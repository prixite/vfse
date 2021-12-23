# Generated by Django 3.2.8 on 2021-12-23 12:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0045_membership_under_review"),
    ]

    operations = [
        migrations.AddField(
            model_name="system",
            name="is_online",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="system",
            name="last_successful_ping_at",
            field=models.DateTimeField(null=True),
        ),
    ]
