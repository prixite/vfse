import django_filters
from vfse import models

class DocumentFilter(django_filters.FilterSet):
    class Meta:
        model = models.Document
        fields = ["folder"]