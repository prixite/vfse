# Generated by Django 4.1 on 2022-09-01 09:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vfse', '0024_auto_20220901_0921'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='categories',
            field=models.ManyToManyField(blank=True, null=True, related_name='documents', to='vfse.category'),
        ),
    ]
