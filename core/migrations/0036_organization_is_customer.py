# Generated by Django 3.2.8 on 2021-12-15 14:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0035_auto_20211215_1012'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='is_customer',
            field=models.BooleanField(default=False),
        ),
    ]
