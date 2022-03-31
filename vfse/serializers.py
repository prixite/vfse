from rest_framework import serializers

from core import models as core_models
from vfse import models


class FolderSerializer(serializers.ModelSerializer):
    document_count = serializers.SerializerMethodField()

    class Meta:
        model = models.Folder
        fields = ["id", "name", "categories", "document_count"]

    def get_document_count(self, obj):
        return obj.documents.count()


class DocumentSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True, max_length=255)
    created_by = serializers.PrimaryKeyRelatedField(
        default=serializers.CurrentUserDefault(),
        queryset=core_models.User.objects.all(),
    )

    class Meta:
        model = models.Document
        fields = [
            "id",
            "title",
            "text",
            "folder",
            "favorite",
            "categories",
            "document_link",
            "created_by",
        ]


class FolderDetailSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True)

    class Meta:
        model = models.Folder
        fields = ["id", "name", "categories", "documents"]


class CategorySerializer(serializers.ModelSerializer):
    folders = FolderSerializer(many=True, required=False)

    class Meta:
        model = models.Category
        fields = ["id", "name", "color", "folders"]
