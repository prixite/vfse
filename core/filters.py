from django_filters import rest_framework as filters

from core import models


class SystemFilters(filters.FilterSet):
    health_network = filters.CharFilter(field_name="site__organization__name")

    class Meta:
        model = models.System
        fields = ["site"]