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

    def test_me_patch(self):
        for user in [
            self.super_admin,
            self.super_manager,
            self.fse,
            self.fse_admin,
            self.end_user,
            self.customer_admin,
            self.cryo_admin,
            self.cryo_fse,
            self.cryo,
            self.one_time,
        ]:
            self.client.force_login(user)
            response = self.client.patch(
                "/api/users/me/",
                data={
                    "first_name": "John",
                    "last_name": "Doe",
                    "meta": {
                        "profile_picture": "http://example.com/profilepic.jpg",
                        "title": "Mr.",
                        "location": "37 Rock Creek St.New Baltimore, MI 48047",
                        "slack_link": "https://acmeco.slack.com/?redir=%2Fteam%2FU1H63D8SZ.",  # noqa
                        "calender_link": "http://www.google.com/calendar/event",
                        "zoom_link": "https://zoom.us/test",
                    },
                },
            )
            self.assertEqual(response.status_code, 200)

    def test_me_patch_invalid(self):
        for user in [
            self.super_admin,
            self.super_manager,
            self.fse,
            self.fse_admin,
            self.end_user,
            self.customer_admin,
            self.cryo_admin,
            self.cryo_fse,
            self.cryo,
            self.one_time,
        ]:
            self.client.force_login(user)
            response = self.client.patch(
                "/api/users/me/",
                data={
                    "first_name": "string",
                    "last_name": "string",
                    "meta": {
                        "profile_picture": "string",
                        "title": "string",
                        "location": "string",
                        "slack_link": "string",
                        "calender_link": "string",
                        "zoom_link": "string",
                    },
                },
            )
            self.assertEqual(response.status_code, 400)
