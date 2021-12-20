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
        "logo": "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
        "banner": "http://example.com/image.jpg",
        "icon": "http://example.com/icon.ico",
    }

    @factory.post_generation
    def fse_admin_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.FSE_ADMIN)

    @factory.post_generation
    def customer_admin_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.CUSTOMER_ADMIN)

    @factory.post_generation
    def user_admin_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.USER_ADMIN)

    @factory.post_generation
    def fse_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.FSE)

    @factory.post_generation
    def end_user_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.END_USER)

    @factory.post_generation
    def view_only_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.VIEW_ONLY)

    @factory.post_generation
    def one_time_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.ONE_TIME)

    @factory.post_generation
    def cryo_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.CRYO)

    @factory.post_generation
    def cryo_fse_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.CRYO_FSE)

    @factory.post_generation
    def cryo_admin_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.CRYO_ADMIN)


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
                role=kwargs.get("role", models.Role.FSE),
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
    meta = {
        'profile_picture':'http://example.com/profile.jpg',
        'title':'He/Mr.'
    }


class MembershipFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Membership


class HealthNetworkFactory(OrganizationFactory):
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
    address = factory.Faker("address")
    organization = factory.SubFactory(OrganizationFactory)


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
    his_ris_info = {
        "ip": "192.187.23.23",
        "title": "HIS System 1",
        "ae_title": "HS1",
        "port": 2000,
    }
    dicom_info = {
        "ip": "192.0.0.9",
        "title": "Dicom System 1",
        "ae_title": "dS1",
        "port": 2850,
    }
    mri_embedded_parameters = {"helium": "Strong", "magnet_pressure": "Low"}


class ManufacturerImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ManufacturerImage

    image = "http://example.com/image.jpeg"


class SystemNoteFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Note


class SystemImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.SystemImage

    image = "http://example.com/systemimage.jpeg"
