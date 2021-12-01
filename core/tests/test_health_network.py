from core.tests.base import BaseTestCase


class HealthNetworkTestCase(BaseTestCase):
    def test_get_list(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/api/health_network/")
        self.assertEqual(response.json()[0]["id"], self.health_network.id)
