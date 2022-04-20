from django.db.models import Count
from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from core import models as core_models
from vfse import filters, models, serializers


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
    serializer_class = serializers.CommentSerializer

    def get_queryset(self):
        return models.Comment.objects.filter(topic_id=self.kwargs["pk"])


class TopicViewset(ModelViewSet):
    serializer_class = serializers.TopicSerializer
    filterset_class = filters.TopicFilterSet

    def get_queryset(self):
        return models.Topic.objects.all().annotate(
            number_of_followers=Count("followers"), number_of_comments=Count("comments")
        )


class PopularTopicsViewset(ModelViewSet):
    serializer_class = serializers.TopicSerializer

    def get_queryset(self):
        return (
            models.Topic.objects.all()
            .annotate(number_of_followers=Count("followers"))
            .order_by("-number_of_followers")[:4]
        )


class DashboardView(APIView):
    serializer_class = serializers.DashboardSerializer

    def get(self, request, format=None):
        systems = core_models.System.objects.all().count()
        online_systems = core_models.System.objects.filter(is_online=True).count()
        serializer = self.serializer_class(
            data={
                "system_count": systems,
                "online_system_count": online_systems,
                "offline_system_count": systems - online_systems,
                "last_month_logged_in_user": core_models.User.objects.filter(
                    last_login__gte=timezone.now().date() - timezone.timedelta(days=30)
                ).count(),
            }
        )
        serializer.is_valid()
        return Response(serializer.data)


class FollowtopicViewset(ModelViewSet):
    serializer_class = serializers.FollowUnfollowSerializer

    def get_queryset(self):
        return models.Topic.objects.all()

    def perform_update(self, serializer):
        if serializer.validated_data["follow"]:
            self.get_object().followers.add(self.request.user)
        else:
            self.get_object().followers.remove(self.request.user)
