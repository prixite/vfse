# Generated by Django 4.0 on 2022-03-25 08:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("vfse", "0007_document_title"),
    ]

    operations = [
        migrations.AddField(
            model_name="category",
            name="color",
            field=models.CharField(default="#28D4AB", max_length=10),
        ),
    ]
