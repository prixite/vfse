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
        customer_admin = factories.UserWithPasswordFactory(
            username="parent-customer-admin@example.com"
        )
        factories.OrganizationFactory(
            name="Child Organization",
            logo="https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
            parent=factories.OrganizationFactory(
                name="Parent Organization",
                logo="https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",  # noqa
                customer_admin_roles=[customer_admin],
            ),
            customer_admin_roles=[customer_admin],
        )

        factories.OrganizationFactory(
            name="Child Organization 2",
            logo="https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png",
            customer_admin_roles=[customer_admin],
        )

        product = factories.ProductFactory(
            manufacturer_modality__manufacturer=factories.ManufacturerFactory(),
            manufacturer_modality__modality=factories.ModalityFactory(),
        )

        organization = factories.OrganizationFactory(
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
                organization_health_network=factories.OrganizationHealthNetworkFactory(
                    organization=organization,
                    health_network=factories.HealthNetworkFactory(),
                )
            ),
            product=product,
            modality=product.manufacturer_modality.modality,
        )

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
