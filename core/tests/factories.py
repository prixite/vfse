import factory
from django.db.models.signals import post_save

from core import models


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = models.Organization

    name = factory.Sequence(lambda x: f"organization-{x}")

    @factory.post_generation
    def customer_admins(obj, create, extracted, **kwargs):
        if not create:
            return

        for user in extracted or []:
            MembershipFactory(
                organization=obj,
                user=user,
                role=models.Membership.Role.CUSTOMER_ADMIN,
            )

    @factory.post_generation
    def fse_admins(obj, create, extracted, **kwargs):
        if not create:
            return

        for user in extracted or []:
            MembershipFactory(
                organization=obj,
                user=user,
                role=models.Membership.Role.FSE_ADMIN,
            )


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

    name = factory.Sequence(lambda x: f"name-{x}")

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
