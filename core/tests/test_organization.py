from core import models
from core.tests import factories
from core.tests.base import BaseTestCase


class OrganizationTestCase(BaseTestCase):
    def test_create_customer_organization(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            "/api/organizations/",
            data={
                "name": "Test Organization",
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
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Organization.objects.get(name="Test Organization").is_customer
        )

    def test_list_organizations_super_users(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get("/api/organizations/")

            organizations = response.json()
            self.assertEqual(len(organizations), 2)

    def test_list_organizations(self):
        for user in [self.customer_admin, self.fse_admin]:
            self.client.force_login(user)
            response = self.client.get("/api/organizations/")

            organizations = response.json()
            self.assertEqual(len(organizations), 1)
            self.assertEqual(organizations[0]["name"], self.organization.name)

    def test_list_organizations_filter(self):
        self.client.force_login(self.super_admin)
        response = self.client.get(f"/api/organizations/?name={self.organization.name}")

        organizations = response.json()
        self.assertEqual(len(organizations), 1)
        self.assertEqual(organizations[0]["name"], self.organization.name)

    def test_organization_health_network_list(self):
        for user in [self.super_admin, self.super_manager, self.customer_admin]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/health_networks/"
            )
            self.assertEqual(len(response.json()), 1)

    def test_site_list_super_users(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/sites/"
            )
            self.assertEqual(len(response.json()), 1)

    def test_user_list(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/users/"
            )
            self.assertEqual(len(response.json()), 14)

    def test_organization_prevent_delete_is_default(self):
        self.client.force_login(self.super_admin)
        for organization, expected_error in [
            (self.organization, 204),
            (self.default_organization, 400),
        ]:
            response = self.client.delete(f"/api/organizations/{organization.id}/")
            self.assertEqual(response.status_code, expected_error)

    def test_get_organization_appearance(self):
        self.client.force_login(self.customer_admin)
        response = self.client.get("/api/organizations/")
        self.assertEqual(response.status_code, 200)
        logo_url = (
            "https://vfse.s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png"
        )
        self.assertDictEqual(
            response.json()[0]["appearance"],
            {
                "sidebar_text": "#94989E",
                "button_text": "#FFFFFF",
                "sidebar_color": "#142139",
                "primary_color": "#773CBD",
                "secondary_color": "#EFE1FF",
                "font_one": "helvetica",
                "font_two": "calibri",
                "logo": logo_url,
                "banner": "http://example.com/image.jpg",
                "icon": "http://example.com/icon.ico",
            },
        )

    def test_update_organization_appearance(self):
        self.client.force_login(self.super_admin)
        new_appearance = {
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
        }
        response = self.client.patch(
            f"/api/organizations/{self.default_organization.id}/",
            data={
                "appearance": new_appearance,
            },
        )
        self.assertEqual(response.status_code, 200)

        self.default_organization.refresh_from_db()
        self.assertDictEqual(self.default_organization.appearance, new_appearance)

    def test_unique_name_constraint_while_create(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            "/api/organizations/",
            data={
                "name": self.default_organization.name,
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_unique_name_constraint_while_update(self):
        self.client.force_login(self.super_admin)
        response = self.client.patch(
            f"/api/organizations/{self.default_organization.id}/",
            data={
                "name": self.organization.name,
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_delete_permissions_super_admin(self):
        self.client.force_login(self.super_admin)
        response = self.client.delete(f"/api/organizations/{self.organization.id}/")
        self.assertEqual(response.status_code, 204)

    def test_delete_permissions_customer_admin(self):
        self.client.force_login(self.customer_admin)
        response = self.client.delete(f"/api/organizations/{self.organization.id}/")
        self.assertEqual(response.status_code, 403)

    def test_update_permissions(self):
        for user, status_code in [(self.super_admin, 200), (self.customer_admin, 200)]:
            self.client.force_login(user)
            response = self.client.patch(
                f"/api/organizations/{self.organization.id}/", data={"name": "new name"}
            )
            self.assertEqual(response.status_code, status_code)

    def test_user_upsert_insert(self):
        self.client.force_login(self.super_admin)
        user_data = {
            "meta": {
                "profile_picture": "http://example.com/profilepic.jpg",
                "title": "Mr.",
            },
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@doe.com",
            "phone": "+19876543210",
            "role": models.Role.FSE,
            "manager": self.customer_admin.id,
            "organization": self.organization.id,
            "sites": [self.site.id],
            "modalities": [self.modality.id],
            "fse_accessible": "false",
            "audit_enabled": "false",
            "can_leave_notes": "false",
            "is_one_time": "false",
            "view_only": "false",
        }
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/users/",
            data={"memberships": [user_data]},
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            models.UserModality.objects.filter(
                user__username=user_data["email"]
            ).exists(),
            True,
        )
        self.assertEqual(
            models.UserSite.objects.filter(user__username=user_data["email"]).exists(),
            True,
        )
        self.assertEqual(
            models.Membership.objects.filter(
                user__username=user_data["email"], role=user_data["role"]
            ).exists(),
            True,
        )

    def test_user_upsert_edit(self):
        self.client.force_login(self.super_admin)
        user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@doe.com",
            "phone": "+19876543210",
            "role": models.Role.FSE_ADMIN,
            "manager": self.customer_admin.id,
            "organization": self.organization.id,
            "sites": [self.site.id],
            "modalities": [self.modality.id],
            "fse_accessible": "false",
            "audit_enabled": "false",
            "can_leave_notes": "false",
            "is_one_time": "false",
            "view_only": "false",
        }
        response = self.client.patch(
            f"/api/users/{self.end_user.id}/",
            data=user_data,
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            models.UserModality.objects.filter(user__email=user_data["email"]).exists(),
            True,
        )
        self.assertEqual(
            models.UserSite.objects.filter(user__email=user_data["email"]).exists(),
            True,
        )
        self.assertEqual(
            models.Membership.objects.filter(
                user__email=user_data["email"], role=user_data["role"]
            ).exists(),
            True,
        )

    def test_retrieve_org(self):
        self.client.force_login(self.super_admin)
        response = self.client.get(f"/api/organizations/{self.organization.id}/")

        self.maxDiff = None
        self.assertEqual(response.status_code, 200)
        self.assertDictEqual(
            response.json(),
            {
                "id": self.organization.id,
                "name": self.organization.name,
                "number_of_seats": self.organization.number_of_seats,
                "appearance": self.organization.appearance,
                "sites": list(self.organization.sites.values("id", "name", "address")),
            },
        )

    def test_health_network_filter(self):
        self.client.force_login(self.super_admin)
        response = self.client.get(
            f"/api/health_networks/?name={self.health_network.name}"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_put_health_networks(self):
        self.client.force_login(self.super_admin)
        response = self.client.put(
            f"/api/organizations/{self.other_organization.id}/health_networks/",
            data={
                "health_networks": [
                    {
                        "name": self.health_network.name,
                        "appearance": {"logo": "https://picsum.photos/200"},
                    },
                    {
                        "name": "New",
                        "appearance": {"logo": "https://picsum.photos/200"},
                    },
                ]
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.other_organization.health_networks.count(), 2)

    def test_put_new_health_network(self):
        self.client.force_login(self.super_admin)
        response = self.client.put(
            f"/api/organizations/{self.other_organization.id}/health_networks/",
            data={
                "health_networks": [
                    {
                        "name": "test health network",
                        "appearance": {"logo": "https://picsum.photos/200"},
                    }
                ]
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.other_organization.health_networks.count(), 1)

        org_health_network = self.other_organization.health_networks.get()
        self.assertDictEqual(
            org_health_network.health_network.appearance,
            {"logo": "https://picsum.photos/200"},
        )

    def test_put_organization_site(self):
        self.client.force_login(self.super_admin)

        response = self.client.get(f"/api/organizations/{self.organization.id}/sites/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        response = self.client.put(
            f"/api/organizations/{self.organization.id}/sites/",
            data={
                "sites": [
                    {"name": "1nd Test Site", "address": "Milky Way"},
                    {"name": "2nd Test Site", "address": "Coma Cluster"},
                ]
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            models.Site.objects.filter(organization=self.organization).count(),
            2,
        )

    def test_post_health_network(self):
        self.client.force_login(self.super_admin)

        response = self.client.post(
            f"/api/organizations/{self.organization.id}/health_networks/",
            data={
                "name": "Latest Health Network",
                "appearance": {
                    "logo": "https://picsum.photos/200",
                },
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            models.OrganizationHealthNetwork.objects.filter(
                organization=self.organization.id, health_network__is_customer=False
            ).count(),
            2,
        )

    def test_post_organization_sites(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/sites/",
            data={
                "name": "New Organization",
                "address": "Lahore k qareeb",
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Site.objects.filter(
                organization=self.organization, name="New Organization"
            ).exists()
        )

    def test_distinct_organization(self):
        self.client.force_login(self.super_admin)

        response = self.client.get(f'/api/distinct_organization/626 Org/')
        self.assertEqual(response.status_code,200)
        self.assertEqual(response.json(),True)
class VfseTestCase(BaseTestCase):
    def test_list_vfse_systems(self):
        models.Seat.objects.create(
            organization=self.organization,
            system=self.system,
        )

        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/seats/"
            )
            self.assertEqual(len(response.json()), 1)

    def test_create_vfse_systems_invalid(self):
        self.client.force_login(self.super_admin)
        new_system = factories.SystemFactory(
            site=self.site,
            image=factories.SystemImageFactory(),
            product_model=factories.ProductModelFactory(
                product=factories.ProductFactory(
                    manufacturer=factories.ManufacturerFactory(
                        image=factories.ManufacturerImageFactory()
                    ),
                ),
                modality=self.modality,
                documentation=factories.DocumentationFactory(),
            ),
        )
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/seats/",
            data={
                "ids": [self.system.id, new_system.id],
            },
        )

        self.assertEqual(response.status_code, 400)

    def test_create_vfse_systems_valid(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/seats/",
            data={
                "seats": [
                    {"system": self.system.id, "organization": self.organization.id}
                ],
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            len(models.Seat.objects.filter(organization=self.organization))
            <= self.organization.number_of_seats
        )
