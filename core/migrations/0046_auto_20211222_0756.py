# Generated by Django 3.2.8 on 2021-12-22 07:56

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


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
            field=models.DateTimeField(
                auto_now_add=True,
                default=datetime.datetime(2021, 12, 22, 7, 56, 26, 703997, tzinfo=utc),
            ),
            preserve_default=False,
        ),
    ]
