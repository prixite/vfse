# Generated by Django 4.0 on 2022-03-03 05:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("vfse", "0004_alter_folder_categories"),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="favorite",
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name="document",
            name="folder",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="documents",
                to="vfse.folder",
            ),
        ),
    ]
