from core.tests.base import BaseTestCase


class OrganizationTestCase(BaseTestCase):
    def test_list_organizations(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get("/api/organizations/")

            organizations = response.json()
            self.assertEqual(len(organizations), 1)
            self.assertEqual(organizations[0]["name"], self.organization.name)
