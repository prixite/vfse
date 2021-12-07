from core.tests import factories
from core.tests.base import BaseTestCase


class UserTestCase(BaseTestCase):
    def test_user_login_non_active(self):
        in_active_user = factories.UserWithPasswordFactory(is_active=False)
        response = self.client.login(  # nosec
            username=in_active_user.username, password="admin"
        )
        self.assertEqual(response, False)
