from django_filters import rest_framework as filters

from core import models


class SystemFilters(filters.FilterSet):
    health_network = filters.NumberFilter(field_name="site__organization")
    modality = filters.NumberFilter(field_name="product_model__modality")

    class Meta:
        model = models.System
        fields = ["site"]


class OrganizationNameFilter(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="iexact")

    class Meta:
        model = models.Organization
        fields = ["name"]


class ProductFilter(filters.FilterSet):
    modality = filters.NumberFilter(field_name="product_models__modality")

    class Meta:
        model = models.Product
        fields = ["manufacturer"]
