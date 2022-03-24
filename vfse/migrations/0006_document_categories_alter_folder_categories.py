# Generated by Django 4.0 on 2022-03-24 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("vfse", "0005_document_favorite_alter_document_folder"),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="categories",
            field=models.ManyToManyField(related_name="documents", to="vfse.Category"),
        ),
        migrations.AlterField(
            model_name="folder",
            name="categories",
            field=models.ManyToManyField(related_name="folders", to="vfse.Category"),
        ),
    ]
