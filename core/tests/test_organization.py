from core import models
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
        user = self.super_admin
        self.client.force_login(user)     
        print(user.get_organizations())   
        for organization, expected_error in [(self.organization,204),(self.default_organization,400)]:
            print(models.Organization.objects.get(id=organization.id))
            response = self.client.delete(f'/api/organizations/{organization.id}/')
            self.assertEqual(response.status_code,expected_error)                      

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
