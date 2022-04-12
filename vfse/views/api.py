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

    def get_serializer_class(self):
        if self.action == "retrieve":
            return serializers.FolderDetailSerializer

        return serializers.FolderSerializer

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
        if getattr(self, "swagger_fake_view", False):
            return models.Document.objects.none()

        return models.Document.objects.all().prefetch_related("categories")


class CommentViewset(ModelViewSet):
    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer

    def get_queryset(self):
        return models.Comment.objects.filter(topic_id=self.kwargs["topic_pk"])


class TopicViewset(ModelViewSet):
    queryset = models.Topic.objects.all()
    serializer_class = serializers.TopicSerializer
