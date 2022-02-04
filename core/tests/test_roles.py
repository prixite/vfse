from faker import Faker

from core.tests.base import BaseTestCase

fake = Faker()
fake.seed_instance(1234)


class PermissionsTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.users = [
            self.super_admin,
            self.super_manager,
            self.customer_admin,
            self.fse_admin,
            self.user_admin,
            self.fse,
            self.view_only,
            self.one_time,
        ]

        self.cryo_users = [
            self.cryo,
            self.cryo_admin,
            self.cryo_fse,
        ]


class AllowAllUsersTestCase(PermissionsTestCase):
    def test_me_api(self):
        for user in self.users:
            self.client.force_login(user)
            response = self.client.get("/api/me/")
            self.assertEqual(response.status_code, 200)
            self.assertListEqual(
                [
                    "id",
                    "first_name",
                    "last_name",
                    "flags",
                    "organization",
                    "role",
                    "profile_picture",
                    "is_superuser",
                ],
                list(response.json().keys()),
            )

    def test_roles_api(self):
        for user in self.users:
            self.client.force_login(user)
            response = self.client.get("/api/users/roles/")
            self.assertEqual(response.status_code, 200)


class OrganizationPermissionTestCase(BaseTestCase):
    def test_organizations_list_permission(self):
        for user, response_status in [
            (self.super_admin, 200),
            (self.customer_admin, 200),
        ]:
            self.client.force_login(user)
            response = self.client.get("/api/organizations/")
            self.assertEqual(response.status_code, response_status)
            # How to test the format of response, it's a list of dictionaries, what one should be looking for?  #noqa

    def test_organization_create_permission(self):
        for user, response_status in [
            (self.super_admin, 201),
            (self.customer_admin, 403),
            (self.fse, 403),
            (self.user_admin, 403),
        ]:
            self.client.force_login(user)
            response = self.client.post(
                "/api/organizations/",
                data={
                    "name": fake.unique.company(),
                    "number_of_seats": 10,
                    "is_default": False,
                    "appearance": {
                        "sidebar_text": "#773CBD",
                        "button_text": "#773CBD",
                        "sidebar_color": "#773CBD",
                        "primary_color": "#773CBD",
                        "secondary_color": "#EFE1FF",
                        "font_one": "helvetica",
                        "font_two": "arial",
                        "logo": "https://picsum.photos/200",
                        "banner": "https://picsum.photos/200",
                        "icon": "https://picsum.photos/200",
                    },
                },
            )
            self.assertEqual(response.status_code, response_status)
