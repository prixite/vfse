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
        return super().get_user_organizations()

    def destroy(self, request, *args, **kwargs):
        if self.get_object().is_default:
            raise exceptions.ValidationError("Cannot delete default organization")

        return super().destroy(request, *args, **kwargs)


class CustomerViewSet(OrganizationViewSet):
    filterset_fields = ["name"]

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
        if self.request.user.is_superuser or self.request.user.is_supermanager:
            # TODO: Find a way to do this with ORM.
            return models.Organization.objects.raw(
                "select distinct org.* from core_organization as org "
                "inner join core_organizationhealthnetwork as org_health on "
                "org.id = org_health.health_network_id"
            )
        return models.Organization.objects.filter(
            id__in=self.request.user.get_organization_health_networks(
                self.kwargs["organization_pk"]
            ),
        ).prefetch_related("sites")

    def get_serializer_class(self):
        return serializers.HealthNetworkSerializer

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)

        if serializer.is_valid():
            models.OrganizationHealthNetwork.objects.filter(
                organization_id=self.kwargs["organization_pk"]
            ).delete()

            for data in serializer.validated_data:
                models.Organization.objects.get_or_create(
                    name=data["name"],
                    defaults={
                        "appearance": data["appearance"],
                    },
                )

            objects = []
            for data in serializer.validated_data:
                objects.append(
                    models.OrganizationHealthNetwork(
                        organization_id=self.kwargs["organization_pk"],
                        health_network=models.Organization.objects.get(
                            name=data["name"]
                        ),
                    )
                )
            models.OrganizationHealthNetwork.objects.bulk_create(objects)
            return Response(serializer.data)
        return Response(serializer.errors)


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
