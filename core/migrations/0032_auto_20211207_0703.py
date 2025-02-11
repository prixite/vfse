# Generated by Django 3.2.8 on 2021-12-07 07:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0031_alter_userhealthnetwork_user"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="audit_enabled",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="profile",
            name="can_leave_notes",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="profile",
            name="fse_accessible",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="profile",
            name="is_one_time",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="profile",
            name="is_view_only",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="profile",
            name="one_time_complete",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="profile",
            name="phone",
            field=models.CharField(default="", max_length=15),
        ),
        migrations.AddField(
            model_name="profile",
            name="view_only",
            field=models.BooleanField(default=False),
        ),
    ]
