from rest_framework.viewsets import ModelViewSet

from vfse import filters, models, serializers


class FolderViewset(ModelViewSet):
    serializer_class = serializers.FolderSerializer

    def get_queryset(self):
        if self.action in ["destroy", "partial_update"]:
            return models.Folder.objects.all()
        return models.Folder.objects.all().prefetch_related("categories")


class DocumentViewSet(ModelViewSet):
    serializer_class = serializers.DocumentSerializer
    filterset_class = filters.DocumentFilter

    def get_queryset(self):
        return models.Document.objects.all()
