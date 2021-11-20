from django.core.management.base import BaseCommand

from core.tests import factories


class Command(BaseCommand):
    help = "Generate fake date"

    def handle(self, *args, **options):
        super_admin = factories.UserFactory(
            is_superuser=True, is_staff=True, username="admin@example.com"
        )
        super_admin.set_password("admin")
        super_admin.save()

        factories.UserFactory(is_supermanager=True)

        fse_admin = factories.UserFactory()
        customer_admin = factories.UserFactory()
        user_admin = factories.UserFactory()
        fse = factories.UserFactory()
        end_user = factories.UserFactory()
        view_only = factories.UserFactory()
        one_time = factories.UserFactory()
        cryo = factories.UserFactory()
        cryo_fse = factories.UserFactory()
        cryo_admin = factories.UserFactory()

        other_customer_admin = factories.UserFactory()
        other_user_admin = factories.UserFactory()

        factories.OrganizationFactory(
            is_default=True,
        )

        organization = factories.OrganizationFactory(
            fse_admin_roles=[fse_admin],
            customer_admin_roles=[customer_admin],
            user_admin_roles=[user_admin],
            fse_roles=[fse],
            end_user_roles=[end_user],
            view_only_roles=[view_only],
            one_time_roles=[one_time],
            cryo_roles=[cryo],
            cryo_fse_roles=[cryo_fse],
            cryo_admin_roles=[cryo_admin],
        )

        health_network = factories.HealthNetworkFactory()

        factories.OrganizationFactory(
            customer_admin_roles=[other_customer_admin],
            user_admin_roles=[other_user_admin],
        )

        site = factories.SiteFactory(
            organization_health_network=factories.OrganizationHealthNetworkFactory(
                organization=organization,
                health_network=health_network,
            )
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
