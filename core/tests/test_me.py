from core.tests.base import BaseTestCase


class MeTestCase(BaseTestCase):
    def test_me(self):
        for user, flags in [
            (
                self.super_admin,
                ["documentation", "modality", "organization", "user", "vfse"],
            ),
            (self.customer_admin, []),
        ]:
            self.client.force_login(user)
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
                    "flags": flags,
                },
            )

            self.assertTrue(data["organization"]["is_default"])
