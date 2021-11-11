from django.core.management.base import BaseCommand

from core.tests import factories


class Command(BaseCommand):
    help = "Generate fake date"

    def handle(self, *args, **options):
        factories.UserFactory(is_superuser=True)
        factories.UserFactory(is_supermanager=True)
        fse_admin = factories.UserFactory()
        customer_admin = factories.UserFactory()
        factories.UserFactory()
        factories.UserFactory()
        factories.UserFactory()
        factories.UserFactory()
        factories.UserFactory()
        factories.UserFactory()
        factories.UserFactory()
        factories.UserFactory()

        other_customer_admin = factories.UserFactory()
        factories.UserFactory()

        factories.OrganizationFactory(
            name="626",
            is_default=True,
        )

        organization = factories.OrganizationFactory(
            customer_admins=[customer_admin],
            fse_admins=[fse_admin],
        )

        health_network = factories.HealthNetworkFactory(
            organizations=[organization],
        )

        factories.OrganizationFactory(
            customer_admins=[other_customer_admin],
        )

        site = factories.SiteFactory(
            organization_health_network__organization=organization,
            organization_health_network__health_network=health_network,
        )

        product = factories.ProductFactory(
            manufacturer_modality__manufacturer=factories.ManufacturerFactory(),
            manufacturer_modality__modality=factories.ModalityFactory(),
        )

        factories.SystemFactory(
            site=site,
            product=product,
            modality=product.manufacturer_modality.modality,
        )

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
