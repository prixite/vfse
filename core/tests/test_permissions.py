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
            for user in models.User.objects.filter(is_lambda_user=False):
                with self.subTest(user=user, url=url):
                    self.client.force_login(user)
                    assert self.client.get(url).status_code == 200
