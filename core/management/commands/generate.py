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

        factories.OrganizationFactory(
            name="Other Organization",
            is_customer=True,
            customer_admin_roles=[
                factories.UserWithPasswordFactory(
                    username="other-customer-admin@example.com"
                )
            ],
            user_admin_roles=[
                factories.UserWithPasswordFactory(
                    username="other-user-admin@example.com"
                )
            ],
        )

        product = factories.ProductFactory(
            manufacturer=factories.ManufacturerFactory(),
        )

        organization = factories.OrganizationFactory(
            name="Organization",
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

        factories.SystemFactory(
            name="System object 1",
            site=factories.SiteFactory(
                organization=factories.HealthNetworkFactory(),
            ),
            product_model=factories.ProductModelFactory(
                product=product,
                modality=factories.ModalityFactory(),
                documentation=factories.DocumentationFactory(),
            ),
        )

        factories.OrganizationFactory.create_batch(20, is_customer=True)
        factories.HealthNetworkFactory.create_batch(20, organizations=[organization])

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
