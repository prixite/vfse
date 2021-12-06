from rest_framework import exceptions, viewsets
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from core import models, serializers
from core.permissions import OrganizationDetailPermission


class MeViewSet(ModelViewSet):
    serializer_class = serializers.MeSerializer

    def get_object(self):
        return self.request.user


class OrganizationViewSet(ModelViewSet):
    serializer_class = serializers.OrganizationSerializer
    permission_classes = [IsAuthenticated, OrganizationDetailPermission]

    def get_queryset(self):
        queryset = models.Organization.objects.all()
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
    def get_queryset(self):
        return models.HealthNetwork.objects.filter(
            id__in=self.request.user.get_organization_health_networks(
                self.kwargs["organization_pk"]
            ),
        ).prefetch_related("sites")

    def get_user_organizations(self):
        if self.request.user.is_superuser or self.request.user.is_superuser:
            return models.Organization.objects.all()
        return models.Organization.objects.filter(
            id__in=self.request.user.get_organizations()
        )

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.OrganizationHealthNetworkCreateSerializer
        return serializers.HealthNetworkSerializer

    def perform_create(self, serializer):
        get_object_or_404(
            self.get_user_organizations(), id=self.kwargs["organization_pk"]
        )
        models.OrganizationHealthNetwork.objects.filter(
            organization=self.kwargs["organization_pk"]
        ).delete()
        new_health_networks = [
            models.OrganizationHealthNetwork(
                organization_id=self.kwargs["organization_pk"],
                health_network=health_network,
            )
            for health_network in serializer.validated_data["health_networks"]
        ]
        models.OrganizationHealthNetwork.objects.bulk_create(new_health_networks)


class OrganizationSiteViewSet(ModelViewSet):
    serializer_class = serializers.SiteSerializer

    def get_queryset(self):
        return models.Site.objects.filter(
            health_network=self.kwargs["health_network_pk"],
            health_network__in=self.request.user.get_organization_health_networks(
                self.kwargs["organization_pk"]
            ),
        )


class OrganizationChildrenViewSet(viewsets.ModelViewSet):
    def get_serializer_class(self):
        if self.action == "create":
            return serializers.OrganizationChildrenSerializer
        return serializers.OrganizationSerializer

    def get_user_organization(self):
        queryset = models.Organization.objects.all()
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return queryset

        return queryset.filter(
            id__in=self.request.user.get_organizations(),
        )

    def get_queryset(self):
        return self.get_user_organization().filter(parent=self.kwargs["pk"])

    def perform_create(self, serializer):
        get_object_or_404(self.get_user_organization(), pk=self.kwargs["pk"])
        organizations = self.get_user_organization()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            if not organizations.filter(
                id__in=self.request.user.get_managed_organizations(),
                pk=self.kwargs["pk"],
            ).exists():
                raise exceptions.PermissionDenied()

        organizations.exclude(id__in=serializer.validated_data["children"]).update(
            parent=None
        )
        organizations.filter(id__in=serializer.validated_data["children"]).update(
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
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.HealthNetwork.objects.all().prefetch_related("sites")
        return models.HealthNetwork.objects.none()

class UserDeactivateViewSet(ModelViewSet):
    
    def get_serializer_class(self):
        if self.action =='partial_update':
            return serializers.UserDeactivateSerializer
        return serializers.UserSerializer


    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.User.objects.all()

        return models.User.objects.filter(
            id__in=models.Membership.objects.filter(
                organization__in=self.request.user.get_organizations(
                    role=[models.Membership.Role.USER_ADMIN]
                ).values_list("user")
            )
        )

    def perform_update(self, serializer):        
        models.User.objects.filter(id__in=serializer.validated_data["user_id"]).update(
            is_active=False
        )
