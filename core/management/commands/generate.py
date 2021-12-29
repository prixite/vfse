from django.core.management.base import BaseCommand

from core.tests import factories


class Command(BaseCommand):
    help = "Generate fake date"

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

        product = factories.ProductFactory(
            manufacturer=factories.ManufacturerFactory(),
        )

        organization = factories.OrganizationFactory(
            name="All Data",
            is_customer=True,
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
        )

        health_network = factories.HealthNetworkFactory(
            name="Health Network with Sites",
            organizations=[organization],
        )

        site = factories.SiteFactory(
            name="Sites with Systems",
            organization=health_network,
        )

        factories.SystemFactory(
            site=site,
            product_model=factories.ProductModelFactory(
                product=product,
                modality=factories.ModalityFactory(),
                documentation=factories.DocumentationFactory(),
            ),
            connection_monitoring=True,
        )

        factories.SystemFactory.create_batch(
            5,
            site=site,
            product_model=factories.ProductModelFactory(
                product=factories.ProductFactory(
                    manufacturer=factories.ManufacturerFactory(),
                ),
                modality=factories.ModalityFactory(),
                documentation=factories.DocumentationFactory(),
            ),
            connection_monitoring=True,
        )

        factories.OrganizationFactory.create_batch(5, is_customer=True)
        factories.HealthNetworkFactory.create_batch(5, organizations=[organization])
        factories.SiteFactory.create_batch(5, organization=health_network)

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
