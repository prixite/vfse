from rest_framework import serializers

from vfse import models


class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Folder
        fields = ["id", "name", "category"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ["id", "name"]


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Document
        fields = ["id", "text", "created_by"]
