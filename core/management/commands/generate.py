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

        factories.UserWithPasswordFactory(
            is_superuser=True, is_staff=True, username="super-admin@example.com"
        )

        factories.UserWithPasswordFactory(
            is_supermanager=True, username="super-manager@example.com"
        )

        factories.OrganizationFactory(
            is_default=True,
            name="626",
        )

        organization = factories.OrganizationFactory(
            name="All Data",
            is_customer=True,
            site__name="All data Site",
            fse_admin_roles=[
                factories.UserWithPasswordFactory(username="fse-admin@example.com")
            ],
            customer_admin_roles=[
                factories.UserWithPasswordFactory(username="customer-admin@example.com")
            ],
            user_admin_roles=[
                factories.UserWithPasswordFactory(username="user-admin@example.com")
            ],
            fse_roles=[factories.UserWithPasswordFactory(username="fse@example.com")],
            end_user_roles=[
                factories.UserWithPasswordFactory(username="end-user@example.com")
            ],
            view_only_roles=[
                factories.UserWithPasswordFactory(username="view-only@example.com")
            ],
            one_time_roles=[
                factories.UserWithPasswordFactory(username="one-time@example.com")
            ],
            cryo_roles=[factories.UserWithPasswordFactory(username="cryo@example.com")],
            cryo_fse_roles=[
                factories.UserWithPasswordFactory(username="cryo-fse@example.com")
            ],
            cryo_admin_roles=[
                factories.UserWithPasswordFactory(username="cryo-admin@example.com")
            ],
            sites=True,
        )

        health_network = factories.HealthNetworkFactory(
            name="Health Network with Sites",
            organizations=[organization],
            site__name="sites with Systems",
            site__system__connection_monitoring=True,
        )

        site = factories.SiteFactory(
            name="Sites with Systems",
            organization=health_network,
            system__connection_monitoring=True,
        )
        # Crothal
        orgnization = factories.OrganizationFactory(
            name="Crothal",
            is_customer=True,
            sites=True,
            site__name="Crothal Site",
            site__system__name="Crothal System",
            site__system__sites=True,
        )
        factories.HealthNetworkFactory(
            name="Crothal Health Network",
            organizations=[orgnization],
        )
        # Alira
        orgnization = factories.OrganizationFactory(
            name="Alira Health",
            logo="https://vfse.s3.us-east-2.amazonaws.com/alirahealth.png",
            is_customer=True,
            sites=True,
            site__name="Alira Site",
            site__system__name="Alira System",
            site__system__sites=True,
        )
        factories.HealthNetworkFactory(
            name="Alira Health Network",
            organizations=[orgnization],
        )
        factories.SystemFactory.create_batch(
            5, sites=True, site=organization.sites.first()
        )
        # Conni
        orgnization = factories.OrganizationFactory(
            name="Conni Health",
            logo="https://vfse.s3.us-east-2.amazonaws.com/connihealth.png",
            is_customer=True,
            sites=True,
            site__name="Conni Site",
            site__system__name="Conni System",
            site__system__sites=True,
        )
        factories.HealthNetworkFactory(
            name="Conni Health Network",
            organizations=[orgnization],
        )
        # Coventry
        orgnization = factories.OrganizationFactory(
            name="Conventry Health",
            logo="https://vfse.s3.us-east-2.amazonaws.com/coventry.png",
            is_customer=True,
            sites=True,
            site__name="Conventry Site",
            site__system__name="Conventry System",
            site__system__sites=True,
        )
        factories.HealthNetworkFactory(
            name="Conventry Health Network",
            organizations=[orgnization],
        )
        # Heart Beat
        orgnization = factories.OrganizationFactory(
            name="Heartbeat Health",
            logo=" https://vfse.s3.us-east-2.amazonaws.com/heartbeat.png",
            is_customer=True,
            sites=True,
            site__name="Heartbeat Site",
            site__system__name="Heartbeat System",
            site__system__sites=True,
        )
        factories.HealthNetworkFactory(
            name="Heartbeat Health Network",
            organizations=[orgnization],
        )

        # Bulk Creations
        factories.SystemFactory.create_batch(
            5,
            site=site,
        )
        factories.OrganizationFactory.create_batch(175, is_customer=True)
        factories.HealthNetworkFactory.create_batch(5, organizations=[organization])
        factories.SiteFactory.create_batch(5, organization=health_network)

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
