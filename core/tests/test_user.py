from django import test

from core import models
from core.tests import factories
from core.tests.base import BaseTestCase


class UserTestCase(BaseTestCase):
    def test_user_login_non_active(self):
        in_active_user = factories.UserWithPasswordFactory(is_active=False)
        response = self.client.login(  # nosec
            username=in_active_user.username, password="admin"
        )
        self.assertEqual(response, False)

    def test_one_time_login(self):
        user = factories.UserWithPasswordFactory(profile__is_one_time=True)
        response = test.Client().post(
            "/accounts/login/",
            data={
                "username": user.username,
                "password": "admin",
            },
            follow=True,
        )
        self.assertEqual(response.context["user"].is_authenticated, True)

    def test_one_time_login_complete(self):
        user = factories.UserWithPasswordFactory(
            profile__is_one_time=True, profile__one_time_complete=True
        )
        response = test.Client().post(
            "/accounts/login/",
            data={
                "username": user.username,
                "password": "admin",
            },
            follow=True,
        )

        self.assertEqual(response.context["user"].is_authenticated, False)

    def test_request_access(self):
        user_data = {
            "meta": {
                "profile_picture": "http://example.com/profilepic.jpg",
                "title": "Mr.",
            },
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@request.com",
            "phone": "+19876543210",
            "role": models.Role.FSE,
            "manager": self.customer_admin.id,
            "organization": self.organization.id,
            "sites": [self.site.id],
            "modalities": [self.modality.id],
            "fse_accessible": "false",
            "audit_enabled": "false",
            "can_leave_notes": "false",
            "is_one_time": "false",
            "view_only": "false",
            "documentation_url": "true",
            "health_networks": [self.health_network.id],
        }
        response = self.client.post("/api/accounts/requests/", data=user_data)

        self.assertEqual(response.status_code, 201)
        user = models.User.objects.get(email="johndoe@request.com", is_active=False)
        self.assertFalse(user.is_active)
        self.assertTrue(models.Membership.objects.get(user=user).under_review)

    def test_user_deactivate(self):
        for user in [self.user_admin]:
            self.client.force_login(user)

            new_user = factories.UserFactory(
                is_active=True, organizations=[self.organization]
            )
            response = self.client.patch(
                "/api/users/deactivate/", data={"users": [new_user.id]}
            )
            self.assertEqual(response.status_code, 200)
            new_user.refresh_from_db()
            self.assertEqual(new_user.is_active, False)

    def test_user_activate(self):
        for user in [self.user_admin]:
            self.client.force_login(user)

            new_user = factories.UserFactory(
                is_active=False, organizations=[self.organization]
            )
            response = self.client.patch(
                "/api/users/activate/", data={"users": [new_user.id]}
            )
            self.assertEqual(response.status_code, 200)
            new_user.refresh_from_db()
            self.assertEqual(new_user.is_active, True)

    def test_list_user_roles(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/api/users/roles/")
        self.assertEqual(len(response.json()),len(models.Role.choices))