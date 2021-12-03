from rest_framework import exceptions, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.viewsets import ModelViewSet

from core import models, serializers
from core.models import Organization


class MeViewSet(ModelViewSet):
    serializer_class = serializers.MeSerializer

    def get_object(self):
        return self.request.user


class OrganizationViewSet(ModelViewSet):
    serializer_class = serializers.OrganizationSerializer

    def get_queryset(self):
        queryset = Organization.objects.all()
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return queryset

        return queryset.filter(
            id__in=self.request.user.get_organizations(),
        )

    def destroy(self, request, *args, **kwargs):
        if self.get_object().is_default:
            raise exceptions.ValidationError("Cannot delete default organization")

        return super().destroy(request, *args, **kwargs)


class OrganizationHealthNetworkViewSet(ModelViewSet):
    serializer_class = serializers.HealthNetworkSerializer

    def get_queryset(self):
        return models.HealthNetwork.objects.filter(
            id__in=models.OrganizationHealthNetwork.objects.filter(
                organization=self.kwargs["organization_pk"],
            ).values_list("health_network")
        )


class OrganizationSiteViewSet(ModelViewSet):
    serializer_class = serializers.SiteSerializer

    def get_queryset(self):
        return models.Site.objects.filter(
            organization_health_network__organization=self.kwargs["organization_pk"],
            organization_health_network__health_network=self.kwargs[
                "health_network_pk"
            ],
        )


class OrganizationChildrenViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action == "create":
            return serializers.OrganizationChildrenSerializer
        return serializers.OrganizationSerializer

    def get_user_organization(self):
        queryset = Organization.objects.all()
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return queryset

        return queryset.filter(
            id__in=self.request.user.get_organizations(),
        )

    def get_queryset(self):
        return self.get_user_organization().filter(parent__id=self.kwargs["pk"])

    def perform_create(self, serializer):
        get_object_or_404(self.get_user_organization(), pk=self.kwargs["pk"])
        orgs = self.get_user_organization()
        managed_orgs = self.request.user.get_managed_organizations()

        if not int(self.kwargs["pk"]) in managed_orgs or not orgs.filter(
            id__in=managed_orgs
        ):
            raise exceptions.PermissionDenied()

        orgs.exclude(id__in=serializer.validated_data["children"]).update(parent=None)
        orgs.filter(id__in=serializer.validated_data["children"]).update(
            parent=self.kwargs["pk"]
        )


class SiteSystemViewSet(ModelViewSet):
    serializer_class = serializers.SystemSerializer

    def get_queryset(self):
        return models.System.objects.filter(
            site=self.kwargs["site_pk"],
        )


class UserViewSet(ModelViewSet):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.User.objects.all()

        return models.User.objects.filter(
            id__in=models.Membership.objects.filter(
                organization__in=self.request.user.get_organizations(),
            ).values_list("user")
        )


class OrganizationUserViewSet(ModelViewSet):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        membership = models.Membership.objects.filter(
            organization=self.kwargs["organization_pk"],
        )

        if not (self.request.user.is_superuser or self.request.user.is_supermanager):
            membership = membership.filter(
                organization__in=self.request.user.get_organizations(),
            )
        return models.User.objects.filter(id__in=membership.values_list("user"))


class VfseSystemViewSet(ModelViewSet):
    serializer_class = serializers.SystemSerializer

    def get_queryset(self):
        assigned = models.Seat.objects.filter(
            organization=self.kwargs["organization_pk"],
        )

        if not (self.request.user.is_superuser or self.request.user.is_supermanager):
            assigned = assigned.filter(
                organization__in=self.request.user.get_organizations(),
            )
        return models.System.objects.filter(id__in=assigned.values_list("system"))


class HealthNetworkViewSet(ModelViewSet):
    serializer_class = serializers.HealthNetworkSerializer

    def get_queryset(self):
        return models.HealthNetwork.objects.all()
