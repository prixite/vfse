from core.tests.base import BaseTestCase


class MeTestCase(BaseTestCase):
    def test_me(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/api/me/")

        data = response.json()
        self.assertDictEqual(
            {
                k: v
                for k, v in data.items()
                if k in ["first_name", "last_name", "flags"]
            },
            {
                "first_name": "",
                "last_name": "",
                "flags": ["documentation", "modality", "organization", "user", "vfse"],
            },
        )

        self.assertTrue(data["organization"]["is_default"])
