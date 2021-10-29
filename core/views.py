from rest_framework.viewsets import ModelViewSet

from core import serializers
from core.models import Organization


class OrganizationViewSet(ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer
