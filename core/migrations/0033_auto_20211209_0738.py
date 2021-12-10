# Generated by Django 3.2.8 on 2021-12-09 07:38

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0032_auto_20211207_0703"),
    ]

    operations = [
        migrations.AlterField(
            model_name="usermodality",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="modalities",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="usersite",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="sites",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
