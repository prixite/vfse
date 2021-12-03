from core import models
from core.tests import factories
from core.tests.base import BaseTestCase


class OrganizationTestCase(BaseTestCase):
    def test_list_organizations_super_users(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get("/api/organizations/")

            organizations = response.json()
            self.assertEqual(len(organizations), 3)

    def test_list_organizations(self):
        for user in [self.customer_admin, self.fse_admin]:
            self.client.force_login(user)
            response = self.client.get("/api/organizations/")

            organizations = response.json()
            self.assertEqual(len(organizations), 1)
            self.assertEqual(organizations[0]["name"], self.organization.name)

    def test_organization_health_network_list(self):
        for user in [self.super_admin, self.super_manager, self.customer_admin]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/health_networks/"
            )
            self.assertEqual(len(response.json()), 1)

    def test_site_list_super_users(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/health_networks/{self.health_network.id}/sites/"  # noqa
            )
            self.assertEqual(len(response.json()), 1)

    def test_user_list(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/users/"
            )
            self.assertEqual(len(response.json()), 10)

    def test_organization_prevent_delete_is_default(self):
        self.client.force_login(self.super_admin)
        for organization, expected_error in [
            (self.organization, 204),
            (self.default_organization, 400),
        ]:
            response = self.client.delete(f"/api/organizations/{organization.id}/")
            self.assertEqual(response.status_code, expected_error)

    def test_get_organization_appearance(self):
        self.client.force_login(self.customer_admin)
        response = self.client.get("/api/organizations/")
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(
            response.json()[0]["appearance"],
            {
                "color_one": "red",
                "color_two": "green",
                "color_three": "blue",
                "font_one": "helvetica",
                "font_two": "calibri",
            },
        )

    def test_update_organization_appearance(self):
        self.client.force_login(self.super_admin)
        new_appearance = {
            "color_one": "violet",
            "color_two": "pink",
            "color_three": "purple",
            "font_one": "Impact",
            "font_two": "Arial",
        }
        response = self.client.patch(
            f"/api/organizations/{self.default_organization.id}/",
            data={
                "appearance": new_appearance,
            },
        )
        self.assertEqual(response.status_code, 200)

        self.default_organization.refresh_from_db()
        self.assertDictEqual(self.default_organization.appearance, new_appearance)

    def test_unique_name_constraint_while_create(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            "/api/organizations/",
            data={
                "name": self.default_organization.name,
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_unique_name_constraint_while_update(self):
        self.client.force_login(self.super_admin)
        response = self.client.patch(
            f"/api/organizations/{self.default_organization.id}/",
            data={
                "name": self.organization.name,
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_add_organization_health_networks(self):
        self.client.force_login(self.fse_admin)
        new_health_network = factories.HealthNetworkFactory()
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/health_networks/",
            data={"health_networks": [new_health_network.id]},
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            models.OrganizationHealthNetwork.objects.filter(
                organization=self.organization, health_network=new_health_network
            ).count(),
            1,
        )


class SiteTestCase(BaseTestCase):
    def test_list_systems(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get(f"/api/sites/{self.site.id}/systems/")
            self.assertEqual(len(response.json()), 1)


class VfseTestCase(BaseTestCase):
    def test_list_cfse_systems(self):
        models.Seat.objects.create(
            organization=self.organization,
            system=self.system,
        )

        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/vfse_systems/"
            )
            self.assertEqual(len(response.json()), 1)
