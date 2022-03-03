from rest_framework import serializers

from vfse import models


class FolderSerializer(serializers.ModelSerializer):
    no_of_documents = serializers.IntegerField(read_only=True)

    class Meta:
        model = models.Folder
        fields = ["id", "name", "categories", "no_of_documents"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ["id", "name"]


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Document
        fields = ["id", "text", "folder", "created_by"]
