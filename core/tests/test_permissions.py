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
    def test_get(self):
        for user in [
            self.test_post_super_admin,
            self.super_manager,
            self.customer_admin,
            self.fse_admin,
            self.user_admin,
            self.fse,
            self.end_user,
            self.view_only,
            self.one_time,
            self.cryo,
            self.cryo_fse,
            self.cryo_admin,
        ]:
            with self.subTest(user=user):
                self.client.force_login(user)
                response = self.client.get("/api/organizations/")
                self.assertEqual(response.status_code, 200)

    def test_post(self):
        for user in [
            self.super_manager,
            self.customer_admin,
            self.fse_admin,
            self.user_admin,
            self.fse,
            self.end_user,
            self.view_only,
            self.one_time,
            self.cryo,
            self.cryo_fse,
            self.cryo_admin,
        ]:
            with self.subTest(user=user):
                self.client.force_login(user)
                response = self.client.post(
                    "/api/organizations/",
                    data={"name": "Test Organization"},
                )
                self.assertEqual(response.status_code, 403)

    def test_post_super_admin(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            "/api/organizations/",
            data={"name": "Test Organization"},
        )
        self.assertEqual(response.status_code, 201)


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
