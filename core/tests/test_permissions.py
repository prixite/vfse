from rest_framework.authtoken.models import Token

from core import models
from core.tests import factories
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
            for user in models.User.objects.all():
                with self.subTest(user=user, url=url):
                    self.client.force_login(user)
                    self.assertEqual(self.client.get(url).status_code, 200)


class TokenAuthUrls(BaseTestCase):
    def test_authenticate(self):
        urls = [
            "/api/users/roles/",
            "/api/organizations/",
            f"/api/organizations/{self.organization.id}/sites/",
            f"/api/organizations/{self.organization.id}/modalities/",
            f"/api/organizations/{self.organization.id}/health_networks/",
        ]
        user = factories.UserWithPasswordFactory(is_request_user=True)
        Token.objects.create(user=user)
        self.client.force_token_login(user)
        for url in urls:
            with self.subTest(url):
                self.assertEqual(self.client.get(url).status_code, 200)


class OrganizationTestCase(BaseTestCase):
    def test_get(self):
        for user in [
            self.super_admin,
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
    def test_get_super_or_member(self):
        for user in [
            self.super_admin,
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
            self.client.force_login(user)
            for organization in models.Organization.objects.all():
                with self.subTest(user=user, organization=organization):
                    response = self.client.get(
                        f"/api/organizations/{self.organization.id}/"
                    )
                    self.assertEqual(response.status_code, 200)

    def test_get_outside_user(self):
        for user in [
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
            self.client.force_login(user)
            for organization in models.Organization.objects.all():
                with self.subTest(user=user, organization=organization):
                    response = self.client.get(
                        f"/api/organizations/{self.other_organization.id}/"
                    )
                    self.assertEqual(response.status_code, 404)

    def test_patch_super_admin_or_customer_admin(self):
        for user in [
            self.super_admin,
            self.customer_admin,
        ]:
            self.client.force_login(user)
            response = self.client.patch(
                f"/api/organizations/{self.organization.id}/",
                data={"name": "Test Organization"},
            )
            self.assertEqual(response.status_code, 200)

    def test_patch_other_users(self):
        for user in [
            self.super_manager,
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
            self.client.force_login(user)
            response = self.client.patch(
                f"/api/organizations/{self.organization.id}/",
                data={"name": "Test Organization"},
            )
            self.assertEqual(response.status_code, 403)

    def test_delete_super_admin(self):
        self.client.force_login(self.super_admin)
        response = self.client.delete(f"/api/organizations/{self.organization.id}/")
        self.assertEqual(response.status_code, 204)

    def test_delete_other_users(self):
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
            self.client.force_login(user)
            response = self.client.delete(f"/api/organizations/{self.organization.id}/")
            self.assertEqual(response.status_code, 403)


class OrganizationHealthNetworkTest(BaseTestCase):
    def test_get(self):
        for user in [
            self.super_admin,
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
                response = self.client.get(
                    f"/api/organizations/{self.organization.id}/health_networks/"
                )
                self.assertEqual(response.status_code, 200)

    def test_put(self):
        for user in [
            self.super_admin,
            self.customer_admin,
        ]:
            with self.subTest(user=user):
                self.client.force_login(self.super_admin)
                response = self.client.put(
                    f"/api/organizations/{self.organization.id}/health_networks/",
                    data={"health_networks": []},
                )
                self.assertEqual(response.status_code, 200)

    def test_put_other_users(self):
        for user in [
            self.super_manager,
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
                response = self.client.put(
                    f"/api/organizations/{self.organization.id}/health_networks/",
                    data={"health_networks": []},
                )
                self.assertEqual(response.status_code, 403)

    def test_post(self):
        for user in [
            self.super_admin,
            self.customer_admin,
        ]:
            with self.subTest(user=user):
                self.client.force_login(user)
                response = self.client.post(
                    f"/api/organizations/{self.organization.id}/health_networks/",
                    data={"name": user.email},
                )
                self.assertEqual(response.status_code, 201)

    def test_post_other_users(self):
        for user in [
            self.super_manager,
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
                response = self.client.patch(
                    f"/api/organizations/{self.organization.id}/health_networks/",
                    data={"name": user.email},
                )
                self.assertEqual(response.status_code, 403)
