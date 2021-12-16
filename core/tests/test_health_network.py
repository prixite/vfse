from core.tests.base import BaseTestCase


class HealthNetworkTestCase(BaseTestCase):
    def test_get_list(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/api/health_network/")
        health_network = response.json()[0]
        self.assertEqual(health_network["id"], self.health_network.id)
        # self.assertEqual(health_network["sites"][0]["id"], self.site.id)

    def test_get_list_non_super(self):
        self.client.force_login(self.customer_admin)
        response = self.client.get("/api/health_network/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 0)
