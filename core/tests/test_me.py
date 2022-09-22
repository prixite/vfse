from core.tests.base import BaseTestCase


class MeTestCase(BaseTestCase):
    def test_me(self):
        for user, flags, organization_id in [
            (
                self.super_admin,
                [
                    "appearance",
                    "documentation",
                    "modality",
                    "organization",
                    "user",
                    "vfse",
                ],
                self.default_organization.id,
            ),
            (
                self.customer_admin,
                ["modality", "organization", "vfse"],
                self.organization.id,
            ),
        ]:
            self.client.force_login(user)
            response = self.client.get(f"/api/organizations/{self.organization.id}/me/")

            data = response.json()
            self.assertDictEqual(
                {
                    k: v
                    for k, v in data.items()
                    if k in ["first_name", "last_name", "flags"]
                },
                {
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "flags": flags,
                },
            )
            self.assertTrue(data["organization"]["id"], organization_id)
