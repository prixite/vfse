# Generated by Django 4.0 on 2022-04-20 09:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0070_system_ssh_password_user_is_remote_user"),
        ("vfse", "0015_recentactivity_topic_alter_comment_topic_and_more"),
    ]

    operations = [
        migrations.CreateModel(
            name="WorkOrder",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("description", models.TextField()),
                ("work_started", models.BooleanField(default=False)),
                ("work_started_at", models.DateTimeField()),
                ("work_completed", models.BooleanField(default=False)),
                ("work_completed_at", models.DateTimeField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "system",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="core.system"
                    ),
                ),
            ],
        ),
    ]
