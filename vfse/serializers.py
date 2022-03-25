from rest_framework import serializers

from vfse import models


class FolderSerializer(serializers.ModelSerializer):
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = models.Folder
        fields = ["id", "name", "categories", "document_count"]

    def get_document_count(self, obj):
        return obj.documents.count()


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Document
        fields = ["id", "title", "text", "folder", "favorite", "created_by"]


class FolderDetailSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True)

    class Meta:
        model = models.Folder
        fields = ["id", "name", "categories", "documents"]


class CategorySerializer(serializers.ModelSerializer):
    folders = FolderSerializer(many=True)

    class Meta:
        model = models.Category
        fields = ["id", "name", "color", "folders"]
