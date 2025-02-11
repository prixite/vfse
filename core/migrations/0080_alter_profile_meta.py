# Generated by Django 4.1.1 on 2022-10-10 09:28

from django.db import migrations


def profile_meta_content(apps, schema_editor):
    Profile = apps.get_model("core", "Profile")

    for profile in Profile.objects.all():
        profile.meta["location"] = ""
        profile.meta["slack_link"] = ""
        profile.meta["calender_link"] = ""
        profile.meta["zoom_link"] = ""
        profile.save()


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0079_alter_membership_role_alter_userhealthnetwork_role"),
    ]

    operations = [
        migrations.RunPython(profile_meta_content, migrations.RunPython.noop),
    ]
