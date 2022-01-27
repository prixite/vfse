# Generated by Django 4.0 on 2022-01-27 12:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0062_alter_profile_phone'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_lambda_user',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='membership',
            name='role',
            field=models.CharField(choices=[('fse-admin', 'FSE Admin'), ('customer-admin', 'Customer Admin'), ('user-admin', 'User Admin'), ('fse', 'Field Service Engineer'), ('end-user', 'End User'), ('view-only', 'View Only'), ('one-time', 'One Time'), ('cryo', 'Cryo'), ('cryo-fse', 'Cryo FSE'), ('cryo-admin', 'Cryo Admin')], default='fse', max_length=32),
        ),
        migrations.AlterField(
            model_name='userhealthnetwork',
            name='role',
            field=models.CharField(choices=[('fse-admin', 'FSE Admin'), ('customer-admin', 'Customer Admin'), ('user-admin', 'User Admin'), ('fse', 'Field Service Engineer'), ('end-user', 'End User'), ('view-only', 'View Only'), ('one-time', 'One Time'), ('cryo', 'Cryo'), ('cryo-fse', 'Cryo FSE'), ('cryo-admin', 'Cryo Admin')], default='fse', max_length=32),
        ),
        migrations.AlterField(
            model_name='usersite',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.user'),
        ),
    ]
