from rest_framework import serializers

from core import models as core_models
from core import serializers as core_serializers
from vfse import models
from vfse.models import Topic


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


class TopicDefault:
    requires_context = True

    def __call__(self, serializer_field):
        return models.Topic.objects.get(
            id=serializer_field.context["view"].kwargs["pk"]
        )


class CommentSerializer(serializers.ModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(
        default=TopicDefault(),
        queryset=models.Topic.objects.all(),
    )

    class Meta:
        model = models.Comment
        fields = ["id", "topic", "user", "comment"]


class TopicSerializer(serializers.ModelSerializer):
    number_of_followers = serializers.IntegerField(read_only=True)
    number_of_comments = serializers.IntegerField(read_only=True)
    followers = core_serializers.ProfileMetaSerializer(many=True)

    class Meta:
        model = Topic
        fields = [
            "id",
            "user",
            "title",
            "description",
            "followers",
            "image",
            "categories",
            "reply_email_notification",
            "number_of_followers",
            "number_of_comments",
        ]


class FollowerSerializer(serializers.ModelSerializer):
    topic = serializers.PrimaryKeyRelatedField(
        default=TopicDefault(),
        queryset=models.Topic.objects.all(),
    )

    class Meta:
        model = models.Follower
        fields = ["user", "topic"]


class DashboardSerializer(serializers.Serializer):
    system_count = serializers.IntegerField()
    online_system_count = serializers.IntegerField()
    offline_system_count = serializers.IntegerField()
    last_month_logged_in_user = serializers.IntegerField()
