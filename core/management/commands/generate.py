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
            logo="https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
        )

        factories.OrganizationFactory(
            name="Other Organization",
            logo="https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
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

        parent_customer_admin = factories.UserWithPasswordFactory(
            username="parent-customer-admin@example.com"
        )

        factories.OrganizationFactory(
            name="Child Organization",
            logo="https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
            parent=factories.OrganizationFactory(
                name="Parent Organization",
                logo="https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",  # noqa
                customer_admin_roles=[parent_customer_admin],
            ),
            customer_admin_roles=[
                factories.UserFactory(
                    username="child-customer-admin@example.com",
                ),
                parent_customer_admin,
            ],
        )

        product = factories.ProductFactory(
            manufacturer=factories.ManufacturerFactory(),
        )

        factories.OrganizationFactory(
            name="Organization",
            logo="https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
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
            site=factories.SiteFactory(
                health_network=factories.HealthNetworkFactory(),
            ),
            product_model=factories.ProductModelFactory(
                product=product,
                modality=factories.ModalityFactory(),
                documentation=factories.DocumentationFactory(),
            ),
        )

        factories.OrganizationFactory.create_batch(20)

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
