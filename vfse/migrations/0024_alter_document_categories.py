# Generated by Django 4.1 on 2022-08-31 11:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vfse', '0023_alter_comment_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='categories',
            field=models.ManyToManyField(default=1, related_name='documents', to='vfse.category'),
        ),
    ]
