# Generated by Django 4.0 on 2021-12-24 11:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0047_auto_20211223_2315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='system',
            name='site',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='core.site'),
        ),
    ]
