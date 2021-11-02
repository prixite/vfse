from django.test import TestCase

from core.tests import client, factories


class BaseTestCase(TestCase):
    def setUp(self):
        self.client = client.Client()

        self.super_admin = factories.UserFactory(is_superuser=True)
        self.super_manager = factories.UserFactory()
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

        self.default_organization = factories.OrganizationFactory(
            is_default=True,
        )

        self.organization = factories.OrganizationFactory(
            super_managers=[self.super_manager],
        )

        self.health_network = factories.HealthNetworkFactory(
            organizations=[self.organization],
        )
