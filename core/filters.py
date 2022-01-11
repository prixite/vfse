from django_filters import rest_framework as filters

from core import models


class SystemFilters(filters.FilterSet):
    health_network = filters.CharFilter(field_name="site__organization")
    modality = filters.CharFilter(field_name="product_model__modality")

    class Meta:
        model = models.System
        fields = ["site"]
