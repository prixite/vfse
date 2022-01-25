from django.core.management.base import BaseCommand
from django.db import transaction

from core.tests import factories


class Command(BaseCommand):
    help = "Generate fake date"

    @transaction.atomic
    def handle(self, *args, **options):

        factories.UserWithPasswordFactory(
            username="mfa@example.com",
            is_superuser=True,
            is_staff=True,
            profile__mfa_enabled=True,
        )

        super_user = factories.UserWithPasswordFactory(
            is_superuser=True, is_staff=True, username="super-admin@example.com"
        )

        factories.UserWithPasswordFactory(
            is_supermanager=True, username="super-manager@example.com",profile__manager=super_user,
        )

        factories.OrganizationFactory(
            is_default=True,
            name="626",
        )

        organization = factories.OrganizationFactory(
            name="All Data",
            is_customer=True,
            site__name="All data Site",
            site__users=[super_user],
            site__system__users=[super_user],
            fse_admin_roles=[
                factories.UserWithPasswordFactory(username="fse-admin@example.com",profile__manager=super_user)
            ],
            customer_admin_roles=[
                factories.UserWithPasswordFactory(username="customer-admin@example.com",profile__manager=super_user)
            ],
            user_admin_roles=[
                factories.UserWithPasswordFactory(username="user-admin@example.com",profile__manager=super_user)
            ],
            fse_roles=[factories.UserWithPasswordFactory(username="fse@example.com",profile__manager=super_user)],
            end_user_roles=[
                factories.UserWithPasswordFactory(username="end-user@example.com",profile__manager=super_user)
            ],
            view_only_roles=[
                factories.UserWithPasswordFactory(username="view-only@example.com",profile__manager=super_user)
            ],
            one_time_roles=[
                factories.UserWithPasswordFactory(username="one-time@example.com",profile__manager=super_user)
            ],
            cryo_roles=[factories.UserWithPasswordFactory(username="cryo@example.com",profile__manager=super_user)],
            cryo_fse_roles=[
                factories.UserWithPasswordFactory(username="cryo-fse@example.com",profile__manager=super_user)
            ],
            cryo_admin_roles=[
                factories.UserWithPasswordFactory(username="cryo-admin@example.com",profile__manager=super_user)
            ],
            sites=True,
        )

        health_network = factories.HealthNetworkFactory(
            name="Health Network with Sites",
            organizations=[organization],
            site__name="sites with Systems",
            site__users=[super_user],
            site__system__users=[super_user],
            site__system__connection_monitoring=True,
        )

        site = factories.SiteFactory(
            name="Site with Systems",
            organization=health_network,
            system__connection_monitoring=True,
            system__users=[super_user],
        )
        # Crothal
        orgnization = factories.OrganizationFactory(
            name="Crothal",
            is_customer=True,
            sites=True,
            site__users=[super_user],
            site__system__users=[super_user],
            site__name="Crothal Site",
            site__system__name="Crothal System",
            site__system__seats=True,
        )
        factories.HealthNetworkFactory(
            name="Crothal Health Network",
            organizations=[orgnization],
            site__users=[super_user],
            site__system__users=[super_user],
        )
        # Alira
        orgnization = factories.OrganizationFactory(
            name="Alira Health",
            logo="https://vfse.s3.us-east-2.amazonaws.com/alirahealth.png",
            is_customer=True,
            sites=True,
            site__users=[super_user],
            site__system__users=[super_user],
            site__name="Alira Site",
            site__system__name="Alira System",
            site__system__seats=True,
        )
        factories.HealthNetworkFactory(
            name="Alira Health Network",
            organizations=[orgnization],
            site__users=[super_user],
            site__system__users=[super_user],
        )
        factories.SystemFactory.create_batch(
            10, seats=True, site=organization.sites.first()
        )
        # Conni
        orgnization = factories.OrganizationFactory(
            name="Conni Health",
            logo="https://vfse.s3.us-east-2.amazonaws.com/connihealth.png",
            is_customer=True,
            sites=True,
            site__name="Conni Site",
            site__system__name="Conni System",
            site__system__seats=True,
            site__users=[super_user],
            site__system__users=[super_user],
        )
        factories.HealthNetworkFactory(
            name="Conni Health Network",
            organizations=[orgnization],
            site__users=[super_user],
            site__system__users=[super_user],
        )
        # Coventry
        orgnization = factories.OrganizationFactory(
            name="Conventry Health",
            logo="https://vfse.s3.us-east-2.amazonaws.com/coventry.png",
            is_customer=True,
            sites=True,
            site__name="Conventry Site",
            site__system__name="Conventry System",
            site__system__seats=True,
            site__users=[super_user],
            site__system__users=[super_user],
        )
        factories.HealthNetworkFactory(
            name="Conventry Health Network",
            organizations=[orgnization],
            site__users=[super_user],
            site__system__users=[super_user],
        )
        # Heart Beat
        orgnization = factories.OrganizationFactory(
            name="Heartbeat Health",
            logo=" https://vfse.s3.us-east-2.amazonaws.com/heartbeat.png",
            is_customer=True,
            sites=True,
            site__name="Heartbeat Site",
            site__system__name="Heartbeat System",
            site__system__seats=True,
            site__users=[super_user],
            site__system__users=[super_user],
        )
        factories.HealthNetworkFactory(
            name="Heartbeat Health Network",
            organizations=[orgnization],
            site__users=[super_user],
            site__system__users=[super_user],
        )

        # Bulk Creations
        factories.SystemFactory.create_batch(
            5,
            site=site,
            users=[super_user],
        )
        factories.OrganizationFactory.create_batch(175, is_customer=True)
        factories.HealthNetworkFactory.create_batch(5, organizations=[organization])
        factories.SiteFactory.create_batch(5, organization=health_network,users=[super_user],
            system__users=[super_user],)
        factories.SystemFactory.create_batch(
            10,
            seats=True,
            site=health_network.sites.get(id=12),
            users=[super_user],
        )
        factories.SiteFactory.create_batch(
            5,
            organization=organization.health_networks.get(
                health_network__id=191
            ).health_network,
            users=[super_user],

        )

        factories.SystemFactory(
            ip_address="10.21.2.21", site=site, connection_monitoring=True
        )
        factories.SystemFactory(
            ip_address="10.21.11.70", site=site, connection_monitoring=True
        )
        factories.SystemFactory(
            ip_address="10.21.12.70", site=site, connection_monitoring=True
        )
        factories.SystemFactory(
            ip_address="10.21.16.70", site=site, connection_monitoring=True
        )

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
