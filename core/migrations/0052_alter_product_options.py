# Generated by Django 4.0 on 2022-01-04 11:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0051_alter_membership_organization_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='product',
            options={'ordering': ['-id']},
        ),
    ]
