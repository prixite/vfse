from core import models
from core.tests.base import BaseTestCase


class UnrestrictedURLsTestCase(BaseTestCase):
    def test_get(self):
        for url in [
            "/api/me/",
            "/api/users/roles/",
            f"/api/organizations/exists/?name={self.organization.name}",
            "/api/modalities/",
            "/api/products/",
            "/api/products/models/",
            "/api/manufacturers/",
            "/api/manufacturers/images/",
        ]:
            for user in models.User.objects.filter(is_lambda_user=False):
                with self.subTest(user=user, url=url):
                    self.client.force_login(user)
                    self.assertEqual(self.client.get(url).status_code, 200)


class OrganizationTestCase(BaseTestCase):
    def test_get_super(self):
        for user in [self.super_admin, self.super_manager]:
            with self.subTest(user=user):
                self.client.force_login(user)
                response = self.client.get("/api/organizations/")
                self.assertEqual(response.status_code, 200)
                self.assertEqual(len(response.json()), 3)


class OrganizationDetailTestCase(BaseTestCase):
    def test_get_super(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            for organization in models.Organization.objects.all():
                with self.subTest(user=user, organization=organization):
                    response = self.client.get(
                        f"/api/organizations/{self.organization.id}/"
                    )
                    self.assertEqual(response.status_code, 200)
