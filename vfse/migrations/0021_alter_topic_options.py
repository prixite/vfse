# Generated by Django 4.0 on 2022-06-06 05:18

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("vfse", "0020_alter_recentactivity_action"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="topic",
            options={"ordering": ["-id"]},
        ),
    ]
