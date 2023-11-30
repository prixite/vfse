from django.db.models import Count, Q
from django.utils import timezone
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView, status
from rest_framework.viewsets import ModelViewSet

from core import models as core_models
from core import permissions
from core.utils import send_topic_email
from vfse import filters, models, pagination, serializers


class CategoryViewSet(ModelViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.FSEAccessPermissions,
    ]
    serializer_class = serializers.CategorySerializer
    filterset_class = filters.CategoryFilterSet

    def get_queryset(self):
        return models.Category.objects.all()


class FolderViewset(ModelViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.FSEAccessPermissions,
    ]
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
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.FSEAccessPermissions,
    ]
    serializer_class = serializers.DocumentSerializer
    filterset_fields = ["folder", "favorite"]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Document.objects.none()

        return (
            models.Document.objects.all().prefetch_related("categories").order_by("-id")
        )


class CommentViewset(ModelViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
    ]
    serializer_class = serializers.CommentSerializer
    pagination_class = pagination.TopicPagination

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Comment.objects.none()
        return (
            models.Comment.objects.filter(
                topic_id=self.kwargs["pk"], parent__isnull=True
            )
            .annotate(
                number_of_replies=Count(
                    "replies", distinct=True, filter=Q(replies__parent__isnull=False)
                )
            )
            .order_by("-id")
        )

    def perform_create(self, serializer):
        topic = models.Topic.objects.get(id=self.kwargs["pk"])
        send_topic_email(topic, self.request.user, serializer.validated_data["comment"])
        return super().perform_create(serializer)


class ReplyViewSet(ModelViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
    ]
    serializer_class = serializers.CommentSerializer
    pagination_class = pagination.TopicPagination

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Comment.objects.none()
        return models.Comment.objects.filter(parent_id=self.kwargs["pk"])

    def create(self, request, *args, **kwargs):
        parent = models.Comment.objects.get(id=self.kwargs["pk"])
        serializer = serializers.ReplySerializer(
            data={
                **request.data,
                "topic": parent.topic_id,
                "parent": parent.id,
            },
            context=self.get_serializer_context(),
        )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class TopicViewset(ModelViewSet):
    permission_classes = [permissions.ViewOnlyPermissions]
    serializer_class = serializers.TopicSerializer
    filterset_class = filters.TopicFilterSet
    pagination_class = pagination.TopicPagination

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return serializers.TopicDetailSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Topic.objects.none()
        topics = models.Topic.objects.filter(user=self.request.user)
        curr_role = self.request.user.get_organization_role(
            self.request.user.get_default_organization().id
        )
        if (
            self.request.user.is_superuser
            or core_models.Role.FSE_ADMIN == curr_role
            or self.action in ["list", "retrieve"]
        ):
            topics = models.Topic.objects.all()

        return topics.annotate(
            number_of_followers=Count("followers", distinct=True),
            number_of_comments=Count(
                "comments", distinct=True, filter=Q(comments__parent__isnull=True)
            ),
        ).order_by("-id")


class PopularTopicsViewset(ModelViewSet):
    serializer_class = serializers.TopicDetailSerializer
    permission_classes = [permissions.FSEAccessPermissions]

    def get_queryset(self):
        return models.Topic.objects.annotate(
            number_of_followers=Count("followers", distinct=True),
            number_of_comments=Count(
                "comments", distinct=True, filter=Q(comments__parent__isnull=True)
            ),
        ).order_by("-number_of_followers")[:4]


class DashboardView(APIView):
    serializer_class = serializers.DashboardSerializer
    permission_classes = [permissions.FSEAccessPermissions]

    def get(self, request, format=None):
        systems = core_models.System.objects.all().count()
        online_systems = core_models.System.objects.filter(is_online=True).count()
        work_order = models.WorkOrder.objects.filter().count()
        serializer = self.serializer_class(
            data={
                "system_count": systems,
                "online_system_count": online_systems,
                "offline_system_count": systems - online_systems,
                "work_order": work_order,
                "last_month_logged_in_user": core_models.User.objects.filter(
                    last_login__gte=timezone.now().astimezone()
                    - timezone.timedelta(days=30)
                ).count(),
            }
        )
        serializer.is_valid()
        return Response(serializer.data)


class TopicActivityViewSet(ListAPIView):
    serializer_class = serializers.RecentActivitySerializer
    permission_classes = [permissions.FSEAccessPermissions]
    filterset_class = filters.TopicActivityFilterSet

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.RecentActivity.objects.none()
        return models.RecentActivity.objects.filter(
            Q(topic__in=self.request.user.topics.all().values_list("id"))
            | Q(topic__in=self.request.user.followed_topics.all().values_list("id"))
        ).order_by("created_at")


class MyTopicActivityViewSet(ListAPIView):
    serializer_class = serializers.RecentActivitySerializer
    pagination_class = pagination.TopicPagination

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.RecentActivity.objects.none()
        return models.RecentActivity.objects.filter(user=self.request.user).order_by(
            "-id"
        )[:50]


class MyTopicsViewSet(ModelViewSet):
    serializer_class = serializers.TopicSerializer
    pagination_class = pagination.TopicPagination
    permission_classes = [permissions.FSEAccessPermissions]

    def get_serializer_class(self):
        if self.action in ["list"]:
            return serializers.TopicDetailSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.RecentActivity.objects.none()

        return self.request.user.topics.annotate(
            number_of_followers=Count("followers", distinct=True),
            number_of_comments=Count(
                "comments", distinct=True, filter=Q(comments__parent__isnull=True)
            ),
        ).all()


class WorkOrderViewset(ModelViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.FSEAccessPermissions,
    ]
    serializer_class = serializers.WorkOrderSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.WorkOrder.objects.none()
        return models.WorkOrder.objects.all()

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return serializers.WorkOrderDetailSerializer
        return super().get_serializer_class()


class FollowtopicViewset(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.FollowUnfollowSerializer

    def get_queryset(self):
        return models.Topic.objects.all()

    def perform_update(self, serializer):
        if serializer.validated_data["follow"]:
            self.get_object().followers.add(self.request.user)
        else:
            self.get_object().followers.remove(self.request.user)
