# Generated by Django 3.2.8 on 2021-12-07 06:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0032_profile_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='view_only',
            field=models.BooleanField(default=False),
        ),
    ]
