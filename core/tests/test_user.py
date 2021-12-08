from django import test
from rest_framework.exceptions import ValidationError

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
        with self.assertRaises(ValidationError):
            test.Client().post(
                "/accounts/login/",
                data={
                    "username": user.username,
                    "password": "admin",
                },
                follow=True,
            )
