import json

import boto3
from django.conf import settings
from django.contrib.auth import update_session_auth_hash
from django.db import IntegrityError, transaction
from django.db.models import Count, Q
from django.db.models.query import Prefetch
from django.http import Http404
from django.utils import timezone
from rest_framework import exceptions
from rest_framework.authentication import (
    SessionAuthentication,
    TokenAuthentication,
)
from rest_framework.authtoken.models import Token
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ViewSet

from core import filters, models, permissions, serializers, utils
from core.views import mixins
from vfse import pagination


class ChatBotView(APIView):
    def get(self, request, system_id=None, format=None):
        message = {"Message": "Welcome to GPT3 ChatBot API"}
        return Response(message)

    def post(self, request, system_id=None, format=None):
        query = request.data.get("query", None)
        response = {
            "response_text": utils.get_chat_bot_response(
                query, models.System.objects.get(id=system_id).chatbot_content
            )
        }

        return Response(response)


class MeUpdateViewSet(ModelViewSet, mixins.UserMixin):
    serializer_class = serializers.MeUpdateSerializer

    def get_queryset(self):
        return models.User.objects.none()

    def partial_update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.update_user(serializer.validated_data, request.user)
        self.update_profile(serializer.validated_data, request.user)
        return Response(serializer.data)


class MeViewSet(ModelViewSet, mixins.UserMixin):
    serializer_class = serializers.MeSerializer

    def get_queryset(self):
        return models.User.objects.none()

    def get_object(self):
        return self.request.user


class DistinctOrganizationViewSet(ModelViewSet):
    serializer_class = serializers.OrganizationSerializer
    filterset_class = filters.OrganizationNameFilter

    def get_queryset(self):
        return models.Organization.objects.all()

    def retrieve(self, request, *args, **kwargs):
        return Response({"ok": self.filter_queryset(self.get_queryset()).exists()})


class OrganizationViewSet(ModelViewSet, mixins.UserOganizationMixin):
    serializer_class = serializers.OrganizationSerializer
    permission_classes = [
        IsAuthenticated,
        permissions.ViewOnlyPermissions,
        permissions.OrganizationDetailPermission,
    ]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Organization.objects.none()

        return super().get_user_organizations()

    def perform_destroy(self, instance):
        if instance.is_default:
            raise exceptions.ValidationError("Cannot delete default organization")

        models.System.objects.filter(site__organization=instance).delete()
        models.Site.objects.filter(organization=instance).delete()
        membership = models.Membership.objects.filter(organization=instance)
        for item in membership:
            models.User.objects.filter(pk=item.user.id).delete()
        instance.delete()

    def perform_update(self, serializer):
        if (
            "logo" in serializer.validated_data.get("appearance", [])
            and serializer.instance.appearance.get("logo")
            != serializer.validated_data["appearance"]["logo"]
            and settings.AWS_THUMBNAIL_LAMBDA_ARN is not None
        ):
            client = boto3.client("lambda")
            client.invoke(
                FunctionName=settings.AWS_THUMBNAIL_LAMBDA_ARN,
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
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.OrganizationPermission,
    ]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Organization.objects.none()

        return (
            super()
            .get_user_organizations()
            .filter(Q(is_customer=True) | Q(is_default=True))
            .prefetch_related("sites")
        )

    def perform_create(self, serializer):
        serializer.save(is_customer=True)


class HealthNetworkViewSet(ListAPIView):
    serializer_class = serializers.HealthNetworkListSerializer
    filterset_class = filters.OrganizationNameFilter

    def get_queryset(self):
        return models.Organization.objects.filter(
            Q(is_customer=False) | Q(is_default=False)
        )


class OrganizationHealthNetworkViewSet(ModelViewSet, mixins.UserOganizationMixin):
    permission_classes = [
        IsAuthenticated,
        permissions.ViewOnlyPermissions,
        permissions.OrganizationHealthNetworksPermission,
    ]
    authentication_classes = [
        SessionAuthentication,
        TokenAuthentication,
    ]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Organization.objects.none()

        if self.action in ["update", "create"]:
            return self.get_user_organizations()

        if (
            self.request.user.is_superuser
            or self.request.user.is_supermanager
            or self.request.user.is_request_user
            or self.is_customer_admin(self.kwargs["pk"])
        ):
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

    @transaction.atomic
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
    permission_classes = [
        permissions.OrganizationSitesPermission,
        # permissions.ViewOnlyPermissions,
    ]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Site.objects.none()

        if self.action in ["update", "create"]:
            return self.get_user_organizations()

        return (
            models.Site.objects.filter(
                organization=self.kwargs["pk"],
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


class OrganizationAllSitesViewSet(ListAPIView):
    serializer_class = serializers.SiteSerializer
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Organization.objects.none()

        if (
            self.request.user.is_superuser
            or self.request.user.is_supermanager
            or self.request.user.is_request_user
        ):
            return models.Organization.get_organization_sites(self.kwargs["pk"])

        return self.request.user.get_organization_sites(
            self.kwargs["pk"]
        ).select_related("organization")


class OrganizationSystemViewSet(ModelViewSet, mixins.UserOganizationMixin):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.OrganizationEndUserReadOnlyPermission,
    ]
    serializer_class = serializers.SystemSerializer
    filterset_class = filters.SystemFilters

    def get_serializer_class(self, *args, **kwargs):
        if self.action == "update_from_influxdb":
            return serializers.InfluxSystemsSerializer
        return super().get_serializer_class(*args, **kwargs)

    def update_from_influxdb(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        response_list = []
        for system in serializer.validated_data["systems"]:
            response = utils.fetch_from_influxdb(system.id)
            serialized_system = serializers.SystemSerializer(instance=response)
            response_list.append(serialized_system.data)
        return Response(response_list)

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.System.objects.none()

        queryset = self.request.user.get_organization_systems(self.kwargs["pk"])
        return (
            queryset.select_related("site", "image", "product_model")
            if self.action != "partial_update"
            else queryset
        )


class SystemViewSet(OrganizationSystemViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.OrganizationEndUserReadOnlyPermission,
    ]
    lookup_url_kwarg = "system_pk"

    def update_from_influx(self, request, *args, **kwargs):
        response = utils.fetch_from_influxdb(self.kwargs["system_pk"])
        serializer = self.get_serializer(response)
        return Response(serializer.data)


class SystemAccessViewSet(ModelViewSet):
    serializer_class = serializers.SystemAccessSerializer
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return models.System.objects.all()

    def retrieve(self, request, *args, **kwargs):
        if (
            not self.get_object().connection_options["ssh"]
            or not request.user.is_remote_user
        ):
            raise Http404("System not found")
        return super().retrieve(request, *args, **kwargs)


class UserViewSet(ModelViewSet, mixins.UserMixin):
    permission_classes = [permissions.ViewOnlyPermissions]

    def get_serializer_class(self):
        return serializers.UpsertUserSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.User.objects.none()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.User.objects.all()

        return models.User.objects.filter(
            id__in=models.Membership.objects.filter(
                organization__in=self.request.user.get_organizations(),
            ).values_list("user")
        )

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        # TODO: Add permission class to allow only self and user admin
        serializer = self.get_serializer(data=request.data, partial=kwargs["partial"])
        if serializer.is_valid(raise_exception=True):
            models.User.objects.filter(id=kwargs["pk"]).update(
                username=serializer.validated_data["email"],
                **{
                    key: serializer.validated_data[key]
                    for key in ["first_name", "last_name", "email"]
                },
            )

            models.Membership.objects.filter(
                user_id=kwargs["pk"],
                organization=serializer.validated_data["organization"],
            ).update(role=serializer.validated_data["role"])

            self.update_profile(serializer.validated_data, kwargs["pk"])

            models.UserSite.objects.filter(user_id=kwargs["pk"]).delete()
            models.UserHealthNetwork.objects.filter(user_id=kwargs["pk"]).delete()
            self.add_sites(serializer.validated_data, kwargs["pk"])

            models.UserModality.objects.filter(user_id=kwargs["pk"]).delete()
            self.add_modalities(serializer.validated_data, kwargs["pk"])

            models.UserSystem.objects.filter(user_id=kwargs["pk"]).delete()
            self.add_user_systems(serializer.validated_data, kwargs["pk"])

            return Response(serializer.data)
        return Response(serializer.errors)


class UserPasswordViewSet(ModelViewSet, mixins.UserMixin):
    def get_serializer_class(self):
        return serializers.UpsertUserPasswordSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.User.objects.none()

        return models.User.objects.filter(id=self.request.user.id)

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, partial=kwargs["partial"])
        if serializer.is_valid(raise_exception=True):
            request.user.set_password(serializer.data["password"])
            request.user.save()
            update_session_auth_hash(request, request.user)
        return Response(serializer.errors)


class ScopedUserViewSet(ModelViewSet, mixins.UserMixin):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.CreateUserPermissions,
    ]
    authentication_classes = [
        SessionAuthentication,
        TokenAuthentication,
    ]

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.OrganizationUpsertUserSerializer
        return serializers.UserSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.User.objects.none()

        all_org_users = (
            models.User.objects.filter(
                is_lambda_user=False,
                is_superuser=False,
                is_supermanager=False,
                is_request_user=False,
                is_remote_user=False,
            )
            .prefetch_related("memberships")
            .select_related("profile")
        )

        if (
            self.request.user.is_superuser
            or self.request.user.is_supermanager
            or self.request.user.is_request_user
        ):
            return all_org_users

        return all_org_users.filter(
            id__in=models.Membership.objects.filter(
                organization=self.kwargs["pk"],
                organization__in=self.request.user.get_organizations(
                    roles=[models.Role.USER_ADMIN]
                ),
            ).values_list("user")
        )

    @transaction.atomic
    def perform_create(self, serializer):
        for data in serializer.validated_data["memberships"]:
            user = models.User.objects.create_user(
                username=data["email"],
                password=models.User.objects.make_random_password(),
                **{key: data[key] for key in ["email", "first_name", "last_name"]},
            )
            self.create_membership(data, user.id)
            self.update_profile(data, user.id)
            self.add_sites(data, user.id)
            self.add_modalities(data, user.id)
            self.add_user_systems(data, user.id)
        serializer.save()


class OrganizationUserViewSet(ScopedUserViewSet):
    permission_classes = [permissions.ViewOnlyPermissions]

    def get_queryset(self):
        queryset = super().get_queryset()
        if getattr(self, "swagger_fake_view", False):
            return queryset.none()
        return queryset.filter(
            memberships__organization=self.kwargs["pk"],
        )


class OrganizationSeatViewSet(ModelViewSet):
    permission_classes = [permissions.ViewOnlyPermissions]

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

    @transaction.atomic
    def perform_create(self, serializer):
        seats = [
            models.Seat(organization_id=self.kwargs["pk"], system=seat["system"])
            for seat in serializer.validated_data["seats"]
        ]
        models.Seat.objects.bulk_create(seats)


class UserDeactivateViewSet(ModelViewSet):
    permission_classes = [permissions.ViewOnlyPermissions]

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
    permission_classes = [permissions.ViewOnlyPermissions]

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
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Modality.objects.none()

        if (
            self.request.user.is_superuser
            or self.request.user.is_supermanager
            or self.request.user.is_request_user
            or self.request.user.get_organization_role(self.kwargs["pk"])
            == models.Role.CUSTOMER_ADMIN
        ):
            return models.Modality.objects.all()

        return models.Modality.objects.filter(
            id__in=models.UserModality.objects.filter(
                organization_id=self.kwargs["pk"], user=self.request.user
            ).values_list("modality")
        )


class ModalityManufacturerViewSet(ModelViewSet):
    serializer_class = serializers.ManufacturerSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Manufacturer.objects.none()

        return models.Manufacturer.objects.filter(
            id__in=models.ProductModel.objects.filter(
                modality_id=self.kwargs["pk"],
            ).values_list("product__manufacturer")
        )


class ProductModelViewSet(ModelViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.EndUserReadOnlyPermission,
    ]
    filterset_class = filters.ProductModelFilter

    def get_queryset(self):
        queryset = models.ProductModel.objects.all()
        if not self.request.user.is_superuser:
            queryset = models.ProductModel.objects.filter(
                modality__in=self.request.user.usermodality_set.all().values_list(
                    "modality"
                )
            )
        if self.action == "list":
            return queryset.select_related("product", "modality", "documentation")

        return queryset

    def get_serializer_class(self):
        if self.action in ["create", "partial_update"]:
            return serializers.ProductModelCreateSerializer
        return serializers.ProductModelSerializer


class ManfucturerViewSet(ModelViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.EndUserReadOnlyPermission,
    ]
    serializer_class = serializers.ManufacturerSerializer

    def get_queryset(self):
        return models.Manufacturer.objects.all()


class SystemNoteViewSet(ModelViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.SystemNotePermissions,
    ]
    serializer_class = serializers.SystemNotesSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Note.objects.none()

        if self.request.user.is_superuser or self.request.user.is_supermanager:
            return models.Note.objects.filter(
                system_id=self.kwargs["pk"]
            ).select_related("author")
        return models.Note.objects.filter(
            system_id=self.kwargs["pk"], author=self.request.user
        ).select_related("author")

    def perform_create(self, serializer):
        serializer.save(system_id=self.kwargs["pk"], author=self.request.user)


class NoteViewSet(ModelViewSet):
    permission_classes = [permissions.ViewOnlyPermissions]
    serializer_class = serializers.NoteSerialier
    permission_classes = [IsAuthenticated, permissions.SystemNotePermissions]

    def get_queryset(self):
        return models.Note.objects.all()


class SystemImageViewSet(ModelViewSet):
    permission_classes = [permissions.ViewOnlyPermissions]
    serializer_class = serializers.SystemImageSerializer

    def get_queryset(self):
        return models.SystemImage.objects.all()


class ManufacturerImagesViewSet(ModelViewSet):
    permission_classes = [permissions.ViewOnlyPermissions]
    serializer_class = serializers.ManufacturerImageSerializer

    def get_queryset(self):
        return models.ManufacturerImage.objects.all()


class UserRequestAccessViewSet(ModelViewSet, mixins.UserMixin):
    permission_classes = [permissions.ViewOnlyPermissions]
    serializer_class = serializers.UserRequestAccessSerializer
    authentication_classes = [TokenAuthentication]

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


class ProductViewSet(ModelViewSet):
    permission_classes = [
        permissions.ViewOnlyPermissions,
        permissions.EndUserReadOnlyPermission,
    ]
    serializer_class = serializers.ProductSerializer
    filterset_class = filters.ProductFilter

    def get_queryset(self):
        queryset = models.Product.objects.all()
        if not self.request.user.is_superuser:
            queryset = models.Product.objects.filter(
                id__in=models.ProductModel.objects.filter(
                    modality__in=self.request.user.usermodality_set.all().values_list(
                        "modality"
                    )
                ).values_list("product")
            )
        if self.action == "list":
            return queryset.select_related("manufacturer")
        return queryset

    def get_serializer_class(self):
        if self.action == "create":
            return serializers.ProductCreateSerializer

        return self.serializer_class

    def perform_create(self, serializer):
        serializer.save(
            name=serializer.validated_data["name"],
            manufacturer=serializer.validated_data["manufacturer"],
        )


class LambdaView(ViewSet):
    serializer_class = serializers.OrganizationAppearanceSerializer
    authentication_classes = [TokenAuthentication]

    def get_object(self):
        token = Token.objects.get(key=self.request.auth)
        org = models.Membership.objects.get(
            user=token.user,
            user__is_lambda_user=True,
        ).organization
        return org

    def partial_update(self, request, *args, **kwargs):
        instance = self.serializer_class(data=request.data, partial=True)
        if instance.is_valid():
            organization = self.get_object()
            organization.appearance["icon"] = instance.validated_data["icon"]
            organization.save()
            return Response("Appearance Updated")

        raise exceptions.ValidationError()


class UserRolesView(ModelViewSet):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    serializer_class = serializers.RoleSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.Role.choices

        return models.Role.choices

    def list(self, request, *args, **kwargs):
        data = [{"value": item, "title": value} for item, value in models.Role.choices]
        serializer = self.serializer_class(data, many=True)
        return Response(serializer.data)


class ActiveUsersViewSet(ListAPIView):
    serializer_class = serializers.UserSerializer
    pagination_class = pagination.ActiveUsersPagtination

    def get_queryset(self):
        return models.User.objects.filter(
            last_login__gte=timezone.now().astimezone() - timezone.timedelta(days=30)
        )


class SystemInfluxView(APIView):
    def get(self, request):
        ip_address = request.query_params.get("ip_address")
        data = utils.get_data_from_influxdb(ip_address)
        return Response({"data": data})


class WebSshLogViewSet(ModelViewSet):
    serializer_class = serializers.WebSshLogSerializer

    def get_queryset(self):
        queryset = models.WebSshLog.objects.all()
        params = self.request.query_params.get

        system = params("system")
        user = params("user")
        if system and user is not None:
            queryset = queryset.filter(system_id=system, user_id=user)

        return queryset


class SystemLocationViewSet(ModelViewSet):
    serializer_class = serializers.RouterLocationSerializer
    filterset_class = filters.RouterLocationFilters

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return models.System.objects.none()

        queryset = self.request.user.get_organization_systems(self.kwargs["pk"])
        queryset = queryset.filter(id=self.kwargs["system_id"])
        return models.RouterLocation.objects.filter(system__in=queryset).order_by(
            "-created_at"
        )
