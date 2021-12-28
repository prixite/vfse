from django.test import TestCase

from core import models
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
            is_customer=True,
            number_of_seats=1,
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

        self.other_organization = factories.OrganizationFactory(
            customer_admin_roles=[self.other_customer_admin],
            user_admin_roles=[self.other_user_admin],
            is_customer=True,
        )

        self.health_network = factories.HealthNetworkFactory(
            name="Health Network Org",
            organizations=[self.organization],
            customer_admin_roles=[self.customer_admin],
        )

        self.user_health_networks = factories.UserHealthNetworkFactory(
            user=self.customer_admin,
            organization_health_network=models.OrganizationHealthNetwork.objects.filter(
                organization=self.organization
            ).first(),
        )

        self.site = factories.SiteFactory(
            organization=self.organization, users=[self.super_admin, self.super_manager]
        )

        self.product = factories.ProductFactory(
            manufacturer=factories.ManufacturerFactory(
                image=factories.ManufacturerImageFactory()
            ),
        )

        self.modality = factories.ModalityFactory()
        self.system = factories.SystemFactory(
            site=self.site,
            image=factories.SystemImageFactory(),
            product_model=factories.ProductModelFactory(
                product=self.product,
                modality=self.modality,
                documentation=factories.DocumentationFactory(),
            ),
        )

        self.note = factories.SystemNoteFactory(
            system=self.system, author=self.super_admin
        )
