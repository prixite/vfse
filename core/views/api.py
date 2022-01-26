import json

import boto3
from django.db import IntegrityError, transaction
from django.db.models import Count, Q
from django.db.models.query import Prefetch
from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet, ViewSet

from app.settings import AWS_THUMBNAIL_LAMBDA_ARN
from core import filters, models, permissions, serializers
from core.views import mixins


class MeViewSet(ModelViewSet):
    serializer_class = serializers.MeSerializer

    def get_object(self):
        return self.request.user


class DistinctOrganizationViewSet(ModelViewSet):
    serializer_class = serializers.OrganizationSerializer
    filterset_class = filters.OrganizationNameFilter

    def get_queryset(self):
        return models.Organization.objects.all()

    def retrieve(self, request, *args, **kwargs):
        try:
            self.filter_queryset(self.get_queryset()).get()
            return Response({"ok": True})
        except models.Organization.DoesNotExist:
            return Response({"ok": False})


class OrganizationViewSet(ModelViewSet, mixins.UserOganizationMixin):
    serializer_class = serializers.OrganizationSerializer
    permission_classes = [IsAuthenticated, permissions.OrganizationDetailPermission]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Organization.objects.none()

        return super().get_user_organizations()

    def perform_destroy(self, instance):
        if instance.is_default:
            raise exceptions.ValidationError("Cannot delete default organization")

        models.System.objects.filter(site__organization=instance).delete()
        instance.delete()

    def perform_update(self, serializer):
        if (
            "logo" in serializer.validated_data.get("appearance", [])
            and serializer.instance.appearance.get("logo")
            != serializer.validated_data["appearance"]["logo"]
            and AWS_THUMBNAIL_LAMBDA_ARN is not None
        ):
            client = boto3.client("lambda")
            client.invoke(
                FunctionName=AWS_THUMBNAIL_LAMBDA_ARN,
                Payload=json.dumps(
                    {
                        "appearance": serializer.validated_data["appearance"],
                        "organization_id": self.kwargs["pk"],
                        "token": self.get_object().get_lambda_admin_token(),
                        "dimension": (50, 50),
                    }
                ),
                InvocationType="Event",
            )
        return super().perform_update(serializer)


class CustomerViewSet(OrganizationViewSet):
    filterset_class = filters.OrganizationNameFilter

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
        serializer.save(is_customer=True)


class OrganizationHealthNetworkViewSet(ModelViewSet, mixins.UserOganizationMixin):
    permission_classes = [IsAuthenticated, permissions.OrganizationReadOnlyPermissions]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Organization.objects.none()

        if self.action in ["update", "create"]:
            return self.get_user_organizations()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.Organization.objects.filter(
                id__in=models.OrganizationHealthNetwork.objects.filter(
                    organization=self.kwargs["pk"]
                ).values_list("health_network")
            ).prefetch_related("sites")

        return models.Organization.objects.filter(
            id__in=self.request.user.get_organization_health_networks(
                self.kwargs["pk"]
            ),
        ).prefetch_related("sites")

    def get_serializer_class(self):
        if self.action == "update":
            return serializers.OrganizationHealthNetworkSerializer
        return serializers.HealthNetworkSerializer

    def perform_create(self, serializer):
        health_network_org = serializer.save()
        models.OrganizationHealthNetwork.objects.create(
            organization_id=self.kwargs["pk"], health_network=health_network_org
        )

    @transaction.atomic
    def perform_update(self, serializer):
        models.OrganizationHealthNetwork.objects.filter(
            organization_id=self.kwargs["pk"]
        ).delete()
        health_networks = []
        validated_data = []

        for item in serializer.validated_data["health_networks"]:
            if item not in validated_data:
                validated_data.append(item)

        for health_network in validated_data or []:
            try:
                obj, created = models.Organization.objects.update_or_create(
                    id=health_network.pop("id", None),
                    defaults=health_network,
                )
            except IntegrityError:
                raise exceptions.ValidationError(
                    f'Organization with name {health_network.get("name")} already exist'
                )

            health_networks.append(obj)
            if obj.id == self.kwargs["pk"]:
                raise exceptions.ValidationError(
                    detail=f"Cannot create self relation organization {obj.name}",
                )

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

        if self.action in ["update", "create"]:
            return self.get_user_organizations()

        return (
            models.Site.objects.filter(
                organization=self.kwargs["pk"],
                organization__in=self.get_user_organizations(),
            )
            .prefetch_related(
                Prefetch(
                    "systems",
                    queryset=models.System.objects.all().select_related(
                        "product_model__modality"
                    ),
                ),
            )
            .annotate(connections=Count("systems"))
        )

    def get_serializer_class(self, *args, **kwargs):
        if self.action == "update":
            return serializers.OrganizationSiteSerializer
        if self.action == "create":
            return serializers.MetaSiteSerializer
        return super().get_serializer_class(*args, **kwargs)

    def perform_create(self, serializer):
        self.get_object()
        models.Site.objects.create(
            organization_id=self.kwargs["pk"], **serializer.validated_data
        )

    @transaction.atomic
    def perform_update(self, serializer):
        names = []
        validted_sites = []
        for item in serializer.validated_data["sites"]:
            if item not in validted_sites:
                validted_sites.append(item)
        for site in validted_sites or []:
            try:
                site_obj, created = models.Site.objects.update_or_create(
                    id=site.pop("id", None),
                    organization_id=self.kwargs["pk"],
                    defaults={**site, "organization_id": self.kwargs["pk"]},
                )
            except IntegrityError:
                raise exceptions.ValidationError(
                    f"Site with name {site['name']} already exists"
                )
            names.append(site_obj.name)

        removed_sites = models.Site.objects.filter(
            organization=self.kwargs["pk"],
        ).exclude(name__in=names)

        models.System.objects.filter(site__in=removed_sites).delete()
        removed_sites.delete()


class OrganizationSystemViewSet(ModelViewSet, mixins.UserOganizationMixin):
    serializer_class = serializers.SystemSerializer
    filterset_class = filters.SystemFilters

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.System.objects.none()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.System.objects.filter(
                Q(site__organization_id=self.kwargs["pk"])
                | Q(
                    site__organization_id__in=models.OrganizationHealthNetwork.objects.filter(  # noqa
                        organization_id=self.kwargs["pk"]
                    ).values_list(
                        "health_network"
                    )
                )
            ).select_related("image", "product_model")

        return models.System.objects.filter(
            id__in=self.request.user.get_organization_systems(self.kwargs["pk"])
        ).select_related("image", "product_model")

    def perform_create(self, serializer):
        seat = serializer.validated_data["connection_options"].pop("vfse")
        system = serializer.save()
        seat_serializer = serializers.OrganizationSeatSeriazlier(
            data={"seats": [{"system": system.id}]}, context={"view": self}
        )
        if seat and seat_serializer.is_valid(raise_exception=True):
            models.Seat.objects.create(system=system, organization_id=self.kwargs["pk"])


class SystemViewSet(OrganizationSystemViewSet):
    lookup_url_kwarg = "system_pk"


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

            self.update_profile(serializer.validated_data, kwargs["pk"])

            models.UserSite.objects.filter(user_id=kwargs["pk"]).delete()
            self.add_sites(serializer.validated_data, kwargs["pk"])

            models.UserModality.objects.filter(user_id=kwargs["pk"]).delete()
            self.add_modalities(serializer.validated_data, kwargs["pk"])

            return Response(serializer.data)
        return Response(serializer.errors)


class OrganizationUserViewSet(ModelViewSet, mixins.UserMixin):
    def get_serializer_class(self):
        if self.action == "create":
            return serializers.OrganizationUpsertUserSerializer
        return serializers.UserSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.User.objects.none()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return (
                models.User.objects.exclude(memberships__role=models.Role.LAMBDA_ADMIN)
                .prefetch_related("memberships")
                .select_related("profile")
            )

        membership = models.Membership.objects.filter(
            organization=self.kwargs["pk"],
            organization__in=self.request.user.get_organizations(
                role=[models.Role.USER_ADMIN]
            ),
        ).exlude(role=models.Role.LAMBDA_ADMIN)

        return (
            models.User.objects.filter(id__in=membership.values_list("user"))
            .prefetch_related("memberships")
            .select_related("profile")
        )

    @transaction.atomic
    def perform_create(self, serializer):
        # TODO: Add permission class to allow only user admin
        for data in serializer.validated_data["memberships"]:
            user = models.User.objects.create_user(
                username=data["email"],
                **{key: data[key] for key in ["email", "first_name", "last_name"]},
            )
            self.create_membership(data, user.id)
            self.update_profile(data, user.id)
            self.add_sites(data, user.id)
            self.add_modalities(data, user.id)


class OrganizationSeatViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action == "create":
            return serializers.OrganizationSeatSeriazlier
        elif self.action == "list":
            return serializers.SeatListSerializer
        return serializers.SeatSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Seat.objects.none()

        assigned = models.Seat.objects.filter(
            organization=self.kwargs["pk"],
        )

        if self.action == "list":
            assigned = assigned.select_related("system")

        if not (self.request.user.is_superuser or self.request.user.is_supermanager):
            assigned = assigned.filter(
                organization__in=self.request.user.get_organizations(),
            )
        return assigned

    def perform_create(self, serializer):
        seats = [
            models.Seat(organization_id=self.kwargs["pk"], system=seat["system"])
            for seat in serializer.validated_data["seats"]
        ]
        models.Seat.objects.bulk_create(seats)


class UserDeactivateViewSet(ModelViewSet):
    def get_serializer_class(self):
        return serializers.UserEnableDisableSerializer

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


class UserActivateViewSet(ModelViewSet):
    def get_serializer_class(self):
        return serializers.UserEnableDisableSerializer

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
        ).update(is_active=True)
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
    def get_queryset(self):
        queryset = models.ProductModel.objects.all()
        if self.action == "list":
            return queryset.select_related("product", "modality", "documentation")

        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.ProductModelCreateSerializer
        return serializers.ProductModelSerializer


class ManfucturerViewSet(ModelViewSet):
    serializer_class = serializers.ManufacturerSerializer

    def get_queryset(self):
        return models.Manufacturer.objects.all()


class SystemNoteViewSet(ModelViewSet):
    serializer_class = serializers.SystemNotesSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Note.objects.none()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.Note.objects.filter(system_id=self.kwargs["pk"])
        return models.Note.objects.filter(
            system_id=self.kwargs["pk"], author=self.request.user
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
            },
        )

        self.create_membership(serializer.validated_data, user.id)
        self.update_profile(serializer.validated_data, user.id)
        self.add_sites(serializer.validated_data, user.id)
        self.add_modalities(serializer.validated_data, user.id)

    def create_membership(self, data, user_id):
        models.Membership.objects.create(
            organization=data["organization"],
            role=data["role"],
            user_id=user_id,
            under_review=True,
        )


class HealthNetworkViewSet(OrganizationViewSet):
    serializer_class = serializers.HealthNetworkSerializer
    filterset_class = filters.OrganizationNameFilter

    def get_queryset(self):
        return super().get_queryset().prefetch_related("sites")


class ProductViewSet(ModelViewSet):
    serializer_class = serializers.ProductSerializer

    def get_queryset(self):
        queryset = models.Product.objects.all()
        if self.action == "list":
            return queryset.select_related("manufacturer")
        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.ProductCreateSerializer

        return self.serializer_class

    def perform_create(self, serializer):
        models.Product.objects.create(
            name=serializer.validated_data["name"],
            manufacturer=serializer.validated_data["manufacturer"],
        )


class LambdaView(ViewSet):
    serializer_class = serializers.OrganizationAppearanceSerializer
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        token = Token.objects.get(key=self.request.auth)
        org = models.Membership.objects.get(
            user=token.user, role=models.Role.LAMBDA_ADMIN
        ).organization
        return org

    def partial_update(self, request, *args, **kwargs):
        instance = self.serializer_class(data=request.data, partial=True)
        if instance.is_valid():
            object = self.get_object()
            object.appearance["icon"] = instance.validated_data["icon"]
            object.save()
            return Response("Appearance Updated")

        raise exceptions.ValidationError()


class UserRolesView(ViewSet):
    def list(self, request, *args, **kwargs):
        return Response(models.Role.choices)
