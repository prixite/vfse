from django.db import transaction
from rest_framework import exceptions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core import models, serializers
from core.permissions import OrganizationDetailPermission
from core.views import mixins


class MeViewSet(ModelViewSet):
    serializer_class = serializers.MeSerializer

    def get_object(self):
        return self.request.user


class OrganizationViewSet(ModelViewSet, mixins.UserOganizationMixin):
    serializer_class = serializers.OrganizationSerializer
    permission_classes = [IsAuthenticated, OrganizationDetailPermission]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Organization.objects.none()

        return super().get_user_organizations()

    def perform_destroy(self, instance):
        if instance.is_default:
            raise exceptions.ValidationError("Cannot delete default organization")

        models.System.objects.filter(site__organization=instance).delete()
        instance.delete()


class CustomerViewSet(OrganizationViewSet):
    filterset_fields = ["name"]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Organization.objects.none()

        return (
            super()
            .get_user_organizations()
            .filter(
                is_customer=True,
                is_default=False,
            )
            .prefetch_related("sites")
        )

    def perform_create(self, serializer):
        models.Organization.objects.create(
            **serializer.validated_data, is_customer=True
        )


class OrganizationHealthNetworkViewSet(ModelViewSet, mixins.UserOganizationMixin):
    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Organization.objects.none()

        if self.action == "update":
            return self.get_user_organizations()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.Organization.objects.filter(
                id__in=models.OrganizationHealthNetwork.objects.filter(
                    organization=self.kwargs["pk"]
                ).values_list("health_network")
            )

        return models.Organization.objects.filter(
            id__in=self.request.user.get_organization_health_networks(
                self.kwargs["pk"]
            ),
        ).prefetch_related("sites")

    def get_serializer_class(self):
        if self.action == "update":
            return serializers.OrganizationHealthNetworkSerializer
        return serializers.HealthNetworkSerializer

    def perform_update(self, serializer):
        models.OrganizationHealthNetwork.objects.filter(
            organization_id=self.kwargs["pk"]
        ).delete()
        health_networks = []
        for health_network in serializer.validated_data["health_networks"]:
            obj, created = models.Organization.objects.get_or_create(
                name=health_network["name"],
                defaults={"appearance": {"logo": health_network["appearance"]["logo"]}},
            )
            health_networks.append(obj)

        models.OrganizationHealthNetwork.objects.bulk_create(
            [
                models.OrganizationHealthNetwork(
                    organization_id=self.kwargs["pk"], health_network=health_network
                )
                for health_network in health_networks
            ]
        )


class OrganizationSiteViewSet(ModelViewSet, mixins.UserOganizationMixin):
    serializer_class = serializers.SiteSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Site.objects.none()

        if self.action == "update":
            return self.get_user_organizations()

        return models.Site.objects.filter(
            organization=self.kwargs["pk"],
            organization__in=self.get_user_organizations(),
        ).prefetch_related("systems")

    def get_serializer_class(self, *args, **kwargs):
        if self.action == "update":
            return serializers.OrganizationSiteSerializer
        return super().get_serializer_class(*args, **kwargs)

    def perform_update(self, serializer):
        names = []
        for site in serializer.validated_data["sites"]:
            names.append(site["name"])
            models.Site.objects.get_or_create(
                name=site["name"],
                organization_id=self.kwargs["pk"],
                defaults={"address": site["address"]},
            )

        removed_sites = models.Site.objects.filter(
            organization=self.kwargs["pk"],
        ).exclude(name__in=names)

        models.System.objects.filter(site__in=removed_sites).delete()
        removed_sites.delete()


class SiteSystemViewSet(ModelViewSet):
    serializer_class = serializers.SystemSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.System.objects.none()

        return models.System.objects.filter(
            site=self.kwargs["site_pk"],
        )


class UserViewSet(ModelViewSet, mixins.UserMixin):
    def get_serializer_class(self):
        return serializers.UpsertUserSerializer

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.User.objects.all()

        return models.User.objects.filter(
            id__in=models.Membership.objects.filter(
                organization__in=self.request.user.get_organizations(),
            ).values_list("user")
        )

    def update(self, request, *args, **kwargs):
        # TODO: Add permission class to allow only self and user admin
        serializer = self.get_serializer(data=request.data, partial=kwargs["partial"])
        if serializer.is_valid():
            models.User.objects.filter(id=kwargs["pk"]).update(
                **{
                    key: serializer.validated_data[key]
                    for key in ["first_name", "last_name", "email"]
                }
            )

            models.Membership.objects.filter(
                user_id=kwargs["pk"],
                organization=serializer.validated_data["organization"],
            ).update(role=serializer.validated_data["role"])

            self.update_profile(serializer, kwargs["pk"])

            models.UserSite.objects.filter(user_id=kwargs["pk"]).delete()
            self.add_sites(serializer, kwargs["pk"])

            models.UserModality.objects.filter(user_id=kwargs["pk"]).delete()
            self.add_modalities(serializer, kwargs["pk"])

            return Response(serializer.data)
        return Response(serializer.errors)


class OrganizationUserViewSet(ModelViewSet, mixins.UserMixin):
    def get_serializer_class(self):
        if self.action == "create":
            return serializers.UpsertUserSerializer
        return serializers.UserSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.User.objects.none()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.User.objects.all()

        membership = models.Membership.objects.filter(
            organization=self.kwargs["organization_pk"],
            organization__in=self.request.user.get_organizations(),
        )

        return models.User.objects.filter(id__in=membership.values_list("user"))

    @transaction.atomic
    def perform_create(self, serializer):
        # TODO: Add permission class to allow only user admin
        user = models.User.objects.create_user(
            username=serializer.validated_data["email"],
            **{
                key: serializer.validated_data[key]
                for key in ["email", "first_name", "last_name"]
            }
        )
        self.create_membership(serializer, user.id)
        self.update_profile(serializer, user.id)
        self.add_sites(serializer, user.id)
        self.add_modalities(serializer, user.id)


class VfseSystemViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action == "create":
            return serializers.SystemSeatSeriazlier
        return serializers.SeatSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Seat.objects.none()

        assigned = models.Seat.objects.filter(
            organization=self.kwargs["organization_pk"],
        )

        if not (self.request.user.is_superuser or self.request.user.is_supermanager):
            assigned = assigned.filter(
                organization__in=self.request.user.get_organizations(),
            )
        return assigned

    def perform_create(self, serializer):
        seats = [
            models.Seat(organization_id=self.kwargs["organization_pk"], system=system)
            for system in serializer.validated_data["ids"]
        ]
        models.Seat.objects.bulk_create(seats)


class UserDeactivateViewSet(ModelViewSet):
    def get_serializer_class(self):
        return serializers.UserDeactivateSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return models.User.objects.all()

        return models.User.objects.filter(
            id__in=models.Membership.objects.filter(
                organization__in=self.request.user.get_organizations(
                    roles=[models.Role.USER_ADMIN]
                )
            ).values_list("user")
        )

    def partial_update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        models.User.objects.filter(
            id__in=[x.id for x in serializer.validated_data["users"]]
        ).update(is_active=False)
        return Response(serializer.data)


class ModalityViewSet(ModelViewSet):

    serializer_class = serializers.ModalitySerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Modality.objects.none()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.Modality.objects.all()

        return models.Modality.objects.filter(
            id__in=models.UserModality.objects.filter(
                user=self.request.user
            ).values_list("modality")
        )


class ProductModelViewSet(ModelViewSet):
    serializer_class = serializers.ProductModelSerializer

    def get_queryset(self):
        return models.ProductModel.objects.all()


class ManfucturerViewSet(ModelViewSet):
    serializer_class = serializers.ManufacturerSerializer

    def get_queryset(self):
        return models.Manufacturer.objects.all()


class SystemNoteViewSet(ModelViewSet):
    serializer_class = serializers.SystemNotesSerializer
    lookup_url_kwarg = "system_id"

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Note.objects.none()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.Note.objects.filter(system_id=self.kwargs["system_id"])
        return models.Note.objects.filter(
            system_id=self.kwargs["system_id"], author=self.request.user
        )


class SystemImageViewSet(ModelViewSet):
    serializer_class = serializers.SystemImageSerializer

    def get_queryset(self):
        return models.SystemImage.objects.all()


class ManufacturerImagesViewSet(ModelViewSet):
    serializer_class = serializers.ManufacturerImageSerializer

    def get_queryset(self):
        return models.ManufacturerImage.objects.all()


class UserRequestAccessViewSet(ModelViewSet, mixins.UserMixin):
    serializer_class = serializers.UserRequestAcessSeriazlizer
    permission_classes = [AllowAny]

    @transaction.atomic
    def perform_create(self, serializer):
        user = models.User.objects.create_user(
            username=serializer.validated_data["email"],
            is_active=False,
            **{
                key: serializer.validated_data[key]
                for key in ["email", "first_name", "last_name"]
            }
        )

        self.create_membership(serializer, user.id)
        self.update_profile(serializer, user.id)
        self.add_sites(serializer, user.id)
        self.add_modalities(serializer, user.id)

    def create_membership(self, serializer, user_id):
        models.Membership.objects.create(
            organization=serializer.validated_data["organization"],
            role=serializer.validated_data["role"],
            user_id=user_id,
            under_review=True,
        )


class HealthNetworkViewSet(OrganizationViewSet):
    serializer_class = serializers.HealthNetworkSerializer
    filterset_fields = ["name"]
