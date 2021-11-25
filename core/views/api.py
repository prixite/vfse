from rest_framework.viewsets import ModelViewSet

from core import models, serializers
from core.models import Organization


class OrganizationViewSet(ModelViewSet):
    serializer_class = serializers.OrganizationSerializer

    def get_queryset(self):
        queryset = Organization.objects.all()
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return queryset

        return queryset.filter(
            id__in=self.request.user.get_organizations(),
        )


class OrganizationHealthNetworkViewSet(ModelViewSet):
    queryset = models.HealthNetwork.objects.all()
    serializer_class = serializers.HealthNetworkSerializer

    def get_queryset(self):
        return self.queryset.filter(
            id__in=models.OrganizationHealthNetwork.objects.filter(
                organization=self.kwargs["organization_pk"],
            ).values_list("health_network")
        )


class OrganizationSiteViewSet(ModelViewSet):
    queryset = models.Site.objects.all()
    serializer_class = serializers.SiteSerializer

    def get_queryset(self):
        return self.queryset.filter(
            organization_health_network__organization=self.kwargs["organization_pk"],
            organization_health_network__health_network=self.kwargs[
                "health_network_pk"
            ],
        )


class SiteSystemViewSet(ModelViewSet):
    queryset = models.System.objects.all()
    serializer_class = serializers.SystemSerializer

    def get_queryset(self):
        return self.queryset.filter(
            site=self.kwargs["site_pk"],
        )


class OrganizationUserViewSet(ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        membership = models.Membership.objects.filter(
            organization=self.kwargs["organization_pk"],
        )

        if not (self.request.user.is_superuser or self.request.user.is_supermanager):
            membership = membership.filter(
                organization__in=self.request.user.get_organizations(),
            )

        return self.queryset.filter(id__in=membership.values_list("user"))


class VfseSystemViewSet(ModelViewSet):
    queryset = models.System.objects.all()
    serializer_class = serializers.SystemSerializer

    def get_queryset(self):
        assigned = models.Seat.objects.filter(
            organization=self.kwargs["organization_pk"],
        )

        if not (self.request.user.is_superuser or self.request.user.is_supermanager):
            assigned = assigned.filter(
                organization__in=self.request.user.get_organizations(),
            )

        return self.queryset.filter(id__in=assigned.values_list("system"))
