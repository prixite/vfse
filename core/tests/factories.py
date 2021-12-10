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
    appearance = {
        "sidebar_text": "#94989E",
        "button_text": "#FFFFFF",
        "sidebar_color": "#142139",
        "primary_color": "#773CBD",
        "font_one": "helvetica",
        "font_two": "calibri",
    }

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

    username = factory.Sequence(lambda x: f"user-{x}@example.com")
    email = factory.LazyAttribute(lambda x: x.username)
    profile = factory.RelatedFactory(
        "core.tests.factories.ProfileFactory", factory_related_name="user"
    )

    @factory.post_generation
    def organizations(
        user,
        create,
        organizations,
        **kwargs,
    ):
        if not create:
            return

        for organization in organizations or []:
            MembershipFactory(
                organization=organization,
                user=user,
                role=kwargs.get("role", models.Membership.Role.FSE),
            )


class UserWithPasswordFactory(UserFactory):
    """
    Do not use in tests. This is slow. This is mainly used for fake data generation.
    """

    @factory.post_generation
    def password(obj, create, extracted, **kwargs):
        if not create:
            return

        obj.set_password("admin")
        obj.save()


@factory.django.mute_signals(post_save)
class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Profile

    user = factory.SubFactory(UserFactory, profile=None)
    is_one_time = False


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

    @factory.post_generation
    def users(obj, create, extracted, **kwargs):
        if not create:
            return

        relations = []
        for user in extracted or []:
            relations.append(
                models.UserHealthNetwork(
                    user=user,
                    health_network=obj,
                )
            )

        models.UserHealthNetwork.objects.bulk_create(relations)


class OrganizationHealthNetworkFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.OrganizationHealthNetwork

    organization = factory.SubFactory(OrganizationFactory)
    health_network = factory.SubFactory(HealthNetworkFactory)


class SiteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Site

    name = factory.Sequence(lambda x: f"site-{x}")
    address = factory.Faker("address")
    health_network = factory.SubFactory(HealthNetworkFactory)


class ModalityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Modality

    name = factory.Sequence(lambda x: f"modality-{x}")


class ManufacturerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Manufacturer

    name = factory.Sequence(lambda x: f"manufacturer-{x}")


class DocumentationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Documentation

    url = "http://example.com/doc.pdf"


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Product

    name = factory.Sequence(lambda x: f"product-{x}")


class ProductModelFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ProductModel

    product = factory.SubFactory(ProductFactory)
    modality = factory.SubFactory(ModalityFactory)
    documentation = factory.SubFactory(DocumentationFactory)


class SystemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.System

    site = factory.SubFactory(SiteFactory)
    product_model = factory.SubFactory(ProductModelFactory)
    ip_address = "127.0.0.1"


class ManufacturerImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ManufacturerImage

    image = "http://example.com/image.jpeg"
