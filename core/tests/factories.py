import factory
from django.db.models.signals import post_save

from core import models


def _add_member(organization, users, role):
    for user in users or []:
        MembershipFactory(
            organization=organization,
            user=user,
            role=role,
        )


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Organization

    name = factory.Sequence(lambda x: f"organization-{x}")

    @factory.post_generation
    def fse_admin_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.FSE_ADMIN)

    @factory.post_generation
    def customer_admin_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.CUSTOMER_ADMIN)

    @factory.post_generation
    def user_admin_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.USER_ADMIN)

    @factory.post_generation
    def fse_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.FSE)

    @factory.post_generation
    def end_user_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.END_USER)

    @factory.post_generation
    def view_only_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.VIEW_ONLY)

    @factory.post_generation
    def one_time_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.ONE_TIME)

    @factory.post_generation
    def cryo_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.CRYO)

    @factory.post_generation
    def cryo_fse_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.CRYO_FSE)

    @factory.post_generation
    def cryo_admin_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Membership.Role.CRYO_ADMIN)


@factory.django.mute_signals(post_save)
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.User

    email = factory.Sequence(lambda x: f"user-{x}@example.com")
    username = factory.LazyAttribute(lambda x: x.email)
    profile = factory.RelatedFactory(
        "core.tests.factories.ProfileFactory", factory_related_name="user"
    )


@factory.django.mute_signals(post_save)
class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Profile

    user = factory.SubFactory(UserFactory, profile=None)


class MembershipFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Membership


class HealthNetworkFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.HealthNetwork

    name = factory.Sequence(lambda x: f"health-network-{x}")

    @factory.post_generation
    def organizations(obj, create, extracted, **kwargs):
        if not create:
            return

        relations = []
        for organization in extracted or []:
            relations.append(
                models.OrganizationHealthNetwork(
                    organization=organization,
                    health_network=obj,
                )
            )

        models.OrganizationHealthNetwork.objects.bulk_create(relations)


class OrganizationHealthNetworkFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.OrganizationHealthNetwork

    organization = factory.SubFactory(OrganizationFactory)
    health_network = factory.SubFactory(HealthNetworkFactory)


class SiteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Site

    name = factory.Sequence(lambda x: f"site-{x}")
    organization_health_network = factory.SubFactory(OrganizationHealthNetworkFactory)


class ModalityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Modality

    name = factory.Sequence(lambda x: f"modality-{x}")


class ManufacturerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Manufacturer

    name = factory.Sequence(lambda x: f"manufacturer-{x}")


class ManufacturerModalityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ManufacturerModality


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Product

    manufacturer_modality = factory.SubFactory(ManufacturerModalityFactory)
    name = factory.Sequence(lambda x: f"product-{x}")


class SystemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.System

    site = factory.SubFactory(SiteFactory)
    modality = factory.SubFactory(ModalityFactory)
    product = factory.SubFactory(ProductFactory)
    ip_address = "0.0.0.0"
