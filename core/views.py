from rest_framework.viewsets import ModelViewSet

from core import serializers
from core.models import Organization


class OrganizationViewSet(ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer

    def get_queryset(self):
        queryset = self.queryset.filter(is_default=False)
        if self.request.user.is_superuser:
            return queryset

        return queryset.filter(
            id__in=self.request.user.get_organizations(),
        )
