# Generated by Django 4.0 on 2022-04-27 06:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("vfse", "0018_alter_workorder_work_completed_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="comment",
            name="parent",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="replies",
                to="vfse.comment",
            ),
        ),
    ]
