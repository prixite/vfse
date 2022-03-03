from django.db.models import Count
from rest_framework.viewsets import ModelViewSet

from vfse import models, serializers


class CategoryViewSet(ModelViewSet):
    serializer_class = serializers.CategorySerializer

    def get_queryset(self):
        return models.Category.objects.all()


class FolderViewset(ModelViewSet):
    serializer_class = serializers.FolderSerializer
    filterset_fields = ["categories"]

    def get_queryset(self):
        if self.action in ["destroy", "partial_update"]:
            return models.Folder.objects.all()
        return (
            models.Folder.objects.all()
            .annotate(no_of_documents=Count("documents"))
            .prefetch_related("categories")
        )


class DocumentViewSet(ModelViewSet):
    serializer_class = serializers.DocumentSerializer
    filterset_fields = ["folder", "favorite"]

    def get_queryset(self):
        return models.Document.objects.all()
