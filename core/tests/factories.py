import factory
from django.db.models.signals import post_save
from faker import Faker

from app import settings
from core import models

fake = Faker()
fake.seed_instance(1234)


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

    name = factory.Sequence(lambda x: str(fake.unique.company()))
    appearance = factory.lazy_attribute(
        lambda obj: {
            "sidebar_text": "#94989E",
            "button_text": "#FFFFFF",
            "sidebar_color": "#142139",
            "primary_color": "#773CBD",
            "secondary_color": "#EFE1FF",
            "font_one": "helvetica",
            "font_two": "calibri",
            "logo": obj.logo,
            "banner": "http://example.com/image.jpg",
            "icon": "http://example.com/icon.ico",
        }
    )
    site = None

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

        _add_member(obj, extracted, models.Role.END_USER)

    @factory.post_generation
    def one_time_roles(obj, create, extracted, **kwargs):
        if not create:
            return

        _add_member(obj, extracted, models.Role.END_USER)

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

    class Params:
        logo = (
            "https://"
            + settings.AWS_STORAGE_BUCKET_NAME
            + ".s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png"
        )
        sites = factory.Trait(
            site=factory.RelatedFactory(
                "core.tests.factories.SiteFactory", factory_related_name="organization"
            )
        )


@factory.django.mute_signals(post_save)
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.User

    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    username = factory.Sequence(lambda x: str(fake.unique.email()))
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
    phone = factory.Faker("bothify", text="+1##########")

    class Meta:
        model = models.Profile

    user = factory.SubFactory(UserFactory, profile=None)
    is_one_time = False
    view_only = False
    fse_accessible = True
    meta = {
        "profile_picture": "https://"
        + settings.AWS_STORAGE_BUCKET_NAME
        + ".s3.us-east-2.amazonaws.com/profile.png",  # noqa
        "title": "",
        "location": "",
        "slack_link": "",
        "calender_link": "",
        "zoom_link": "",
    }


class MembershipFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Membership


class HealthNetworkFactory(OrganizationFactory):
    name = factory.Faker("company")
    sites = False

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
        org_health_network = models.OrganizationHealthNetwork.objects.filter(
            health_network=obj
        ).first()
        models.UserHealthNetwork.objects.bulk_create(
            [
                models.UserHealthNetwork(
                    user=user, organization_health_network=org_health_network
                )
                for user in extracted or []
            ]
        )


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
    system = factory.RelatedFactory(
        "core.tests.factories.SystemFactory", factory_related_name="site"
    )

    @factory.post_generation
    def users(obj, create, extracted, **kwargs):
        if not create:
            return

        models.UserSite.objects.bulk_create(
            models.UserSite(user=user, site=obj, organization=obj.organization)
            for user in extracted or []
        )


class ModalityFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Modality
        django_get_or_create = ["group"]

    name = factory.Iterator([x[1] for x in models.ModalityType.choices])
    group = factory.Iterator([x[0] for x in models.ModalityType.choices])

    @factory.post_generation
    def users(obj, create, extracted, **kwargs):
        if not create:
            return

        models.UserModality.objects.bulk_create(
            models.UserModality(
                user=user, modality=obj, organization=kwargs["organization"]
            )
            for user in extracted or []
        )


class ManufacturerImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ManufacturerImage

    image = "http://example.com/image.jpeg"


class ManufacturerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Manufacturer

    name = factory.Sequence(lambda x: f"manufacturer-{x}")
    image = factory.SubFactory(ManufacturerImageFactory)


class DocumentationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Documentation

    url = "http://example.com/doc.pdf"


class ProductFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Product

    name = factory.Sequence(lambda x: f"product-{x}")
    manufacturer = factory.SubFactory(ManufacturerFactory)


class ProductModelFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.ProductModel

    model = factory.Sequence(lambda x: f"Model-{x}")
    product = factory.SubFactory(ProductFactory)
    modality = factory.SubFactory(ModalityFactory)
    documentation = factory.SubFactory(DocumentationFactory)


class SeatFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Seat


class SystemImageFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.SystemImage

    image = "//tinyurl.com/systm-image"


class SystemNoteFactory(factory.django.DjangoModelFactory):
    note = factory.Faker("sentence")

    class Meta:
        model = models.Note


class SystemFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.System

    name = factory.Sequence(lambda x: f"System-{x}")
    product_model = factory.SubFactory(ProductModelFactory)
    image = factory.SubFactory(SystemImageFactory)
    ip_address = "127.0.0.1"
    software_version = factory.Faker("bothify", text="v#.#")
    asset_number = factory.Faker("bothify", text="??##?##?##")
    serial_number = factory.Faker("ssn")
    local_ae_title = factory.Faker("sentence", nb_words=2)
    location_in_building = factory.Faker("street_name")
    system_contact_info = factory.Faker("bothify", text="+1##########")
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
    mri_embedded_parameters = {
        "helium": "Strong",
        "magnet_pressure": "Low",
    }
    connection_options = {
        "virtual_media_control": False,
        "service_web_browser": False,
        "ssh": False,
    }

    class Params:
        seats = factory.Trait(
            seat=factory.RelatedFactory(
                SeatFactory,
                factory_related_name="system",
                organization=factory.SelfAttribute("..site.organization"),
            )
        )

    @factory.post_generation
    def users(obj, create, extracted, **kwargs):
        if not create:
            return

        models.UserSystem.objects.bulk_create(
            models.UserSystem(
                user=user,
                system=obj,
                organization=obj.site.organization,
                read_only=False,
            )
            for user in extracted or []
        )

        models.Note.objects.bulk_create(
            [
                models.Note(author=user, system=obj, note=fake.sentence())
                for user in extracted or []
            ]
        )
