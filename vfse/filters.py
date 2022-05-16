from django.db.models import Q
from django_filters import rest_framework as filters

from vfse import models


class TopicFilterSet(filters.FilterSet):
    followed = filters.BooleanFilter(
        label="followed", field_name="followers", method="get_followed_topics"
    )
    created = filters.BooleanFilter(
        label="created", field_name="user", method="get_created_topics"
    )
    query = filters.CharFilter(label="query", method="get_query_results")

    class Meta:
        models = models.Topic

    def get_created_topics(self, queryset, name, value):
        if not value:
            return models.Topic.objects.none()

        return queryset.filter(user=self.request.user)

    def get_followed_topics(self, queryset, name, value):
        if not value:
            return models.Topic.objects.none()

        return queryset.filter(followers=self.request.user)

    def get_query_results(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            Q(title__icontains=value) | Q(description__icontains=value)
        )
