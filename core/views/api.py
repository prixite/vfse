from django.db import transaction
from rest_framework import exceptions
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
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
        return super().get_user_organizations()

    def destroy(self, request, *args, **kwargs):
        if self.get_object().is_default:
            raise exceptions.ValidationError("Cannot delete default organization")

        return super().destroy(request, *args, **kwargs)


class CustomerViewSet(OrganizationViewSet):
    def get_queryset(self):
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
        return (
            super()
            .get_user_organizations()
            .filter(
                id__in=self.request.user.get_organization_health_networks(
                    self.kwargs["organization_pk"]
                ),
            )
            .prefetch_related("sites")
        )

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.OrganizationHealthNetworkCreateSerializer
        return serializers.HealthNetworkSerializer

    def perform_create(self, serializer):
        get_object_or_404(
            super().get_user_organizations(), id=self.kwargs["organization_pk"]
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


class OrganizationSiteViewSet(ModelViewSet, mixins.UserOganizationMixin):
    serializer_class = serializers.SiteSerializer

    def get_queryset(self):
        return models.Site.objects.filter(
            organization=self.kwargs["organization_pk"],
            organization__in=self.get_user_organizations(),
        )


class SiteSystemViewSet(ModelViewSet):
    serializer_class = serializers.SystemSerializer

    def get_queryset(self):
        return models.System.objects.filter(
            site=self.kwargs["site_pk"],
        )


class UserViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ["create", "partial_update"]:
            return serializers.UpsertUserSerializer
        return serializers.UserSerializer

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.User.objects.all()

        return models.User.objects.filter(
            id__in=models.Membership.objects.filter(
                organization__in=self.request.user.get_organizations(
                    roles=[models.Membership.Role.USER_ADMIN]
                ),
            ).values_list("user")
        )

    @transaction.atomic
    def perform_create(self, serializer):
        user = models.User.objects.create_user(
            username=serializer.validated_data["email"],
            **{
                key: serializer.validated_data[key]
                for key in ["email", "first_name", "last_name"]
            }
        )
        self.create_membership(serializer,user.id)
        self.update_profile(serializer, user.id)
        self.add_sites(serializer, user.id)
        self.add_modalities(serializer, user.id)

    def create_membership(self,serializer,user_id):
        models.Membership.objects.create(
            organization=serializer.validated_data["organization"],
            role=serializer.validated_data["role"],
            user_id=user_id,
        )

    def update_profile(self, serializer, user_id):
        models.Profile.objects.filter(user_id=user_id).update(
            **{
                key: serializer.validated_data[key]
                for key in [
                    "manager",
                    "phone",
                    "fse_accessible",
                    "audit_enabled",
                    "can_leave_notes",
                    "view_only",
                    "is_one_time",
                ]
            }
        )

    def add_sites(self, serializer, user_id):
        sites = [
            models.UserSite(user_id=user_id, site=site)
            for site in serializer.validated_data["sites"]
        ]
        models.UserSite.objects.bulk_create(sites)

    def add_modalities(self, serializer, user_id):
        modalities = [
            models.UserModality(user_id=user_id, modality=modality)
            for modality in serializer.validated_data["modalities"]
        ]
        models.UserModality.objects.bulk_create(modalities)

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs["partial"])
        if serializer.is_valid():
            models.User.objects.filter(id=kwargs["pk"]).update(
                **{
                    key: serializer.validated_data[key]
                    for key in ["first_name", "last_name", "email"]
                }
            )
            models.Membership.objects.filter(user__id=kwargs["pk"]).update(
                organization=serializer.validated_data["organization"],
                role=serializer.validated_data["role"],
            )
            self.update_profile(serializer, kwargs["pk"])

            models.UserSite.objects.filter(user_id=kwargs["pk"]).delete()
            self.add_sites(serializer, kwargs["pk"])

            models.UserModality.objects.filter(user_id=kwargs["pk"]).delete()
            self.add_modalities(serializer, kwargs["pk"])

            return Response(serializer.data)
        return Response(serializer.errors)


class OrganizationUserViewSet(UserViewSet):
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.User.objects.all()

        membership = models.Membership.objects.filter(
            organization=self.kwargs["organization_pk"],
            organization__in=self.request.user.get_organizations(),
        )

        return models.User.objects.filter(id__in=membership.values_list("user"))

    def create_membership(self,serializer,user_id):
        models.Membership.objects.create(
            parent_id=self.kwargs['organization_pk'],
            organization=serializer.validated_data["organization"],
            role=serializer.validated_data["role"],
            user_id=user_id,
        )
class VfseSystemViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action == "create":
            return serializers.SystemSeatSeriazlier
        return serializers.SeatSerializer

    def get_queryset(self):
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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["organization_pk"] = self.kwargs["organization_pk"]
        return context


class UserDeactivateViewSet(ModelViewSet):
    def get_serializer_class(self):
        return serializers.UserDeactivateSerializer

    def get_queryset(self):
        if self.request.user.is_superuser:
            return models.User.objects.all()

        return models.User.objects.filter(
            id__in=models.Membership.objects.filter(
                organization__in=self.request.user.get_organizations(
                    roles=[models.Membership.Role.USER_ADMIN]
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
