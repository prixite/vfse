from django.test import TestCase

from core.tests import client, factories


class BaseTestCase(TestCase):
    def setUp(self):
        self.client = client.Client()

        self.super_admin = factories.UserFactory(is_superuser=True)
        self.super_manager = factories.UserFactory(is_supermanager=True)

        self.fse_admin = factories.UserFactory()
        self.customer_admin = factories.UserFactory()
        self.user_admin = factories.UserFactory()
        self.fse = factories.UserFactory()
        self.end_user = factories.UserFactory()
        self.view_only = factories.UserFactory()
        self.one_time = factories.UserFactory()
        self.cryo = factories.UserFactory()
        self.cryo_fse = factories.UserFactory()
        self.cryo_admin = factories.UserFactory()

        self.other_customer_admin = factories.UserFactory()
        self.other_user_admin = factories.UserFactory()

        self.default_organization = factories.OrganizationFactory(
            is_default=True,
        )

        self.organization = factories.OrganizationFactory(
            fse_admin_roles=[self.fse_admin],
            customer_admin_roles=[self.customer_admin],
            user_admin_roles=[self.user_admin],
            fse_roles=[self.fse],
            end_user_roles=[self.end_user],
            view_only_roles=[self.view_only],
            one_time_roles=[self.one_time],
            cryo_roles=[self.cryo],
            cryo_fse_roles=[self.cryo_fse],
            cryo_admin_roles=[self.cryo_admin],
        )

        self.health_network = factories.HealthNetworkFactory()

        self.child_organization = factories.OrganizationFactory(
            customer_admin_roles=[self.customer_admin],
            parent=self.organization,
            fse_admin_roles=[self.fse_admin],
        )

        self.other_organization = factories.OrganizationFactory(
            customer_admin_roles=[self.other_customer_admin],
            user_admin_roles=[self.other_user_admin],
        )

        self.site = factories.SiteFactory(
            organization_health_network=factories.OrganizationHealthNetworkFactory(
                organization=self.organization,
                health_network=self.health_network,
            )
        )

        self.product = factories.ProductFactory(
            manufacturer_modality__manufacturer=factories.ManufacturerFactory(),
            manufacturer_modality__modality=factories.ModalityFactory(),
        )

        self.system = factories.SystemFactory(
            site=self.site,
            product=self.product,
            modality=self.product.manufacturer_modality.modality,
        )
