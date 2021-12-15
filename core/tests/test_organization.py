from core import models
from core.tests import factories
from core.tests.base import BaseTestCase


class OrganizationTestCase(BaseTestCase):
    def test_create_organization_is_customer(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            "/api/organizations/",
            data={
                "name": "Test Organization",
                "logo": "https://picsum.photos/200",
                "banner": "https://picsum.photos/200",
                "number_of_seats": 10,
                "is_default": False,
                "appearance": {
                    "sidebar_text": "#773CBD",
                    "button_text": "#773CBD",
                    "sidebar_color": "#773CBD",
                    "primary_color": "#773CBD",
                    "font_one": "helvetica",
                    "font_two": "arial",
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
            self.assertEqual(len(organizations), 3)

    def test_list_organizations(self):
        for user in [self.customer_admin, self.fse_admin]:
            self.client.force_login(user)
            response = self.client.get("/api/organizations/")

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
                f"/api/organizations/{self.organization.id}/health_networks/{self.health_network.id}/sites/"  # noqa
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
        self.assertDictEqual(
            response.json()[0]["appearance"],
            {
                "sidebar_text": "#94989E",
                "button_text": "#FFFFFF",
                "sidebar_color": "#142139",
                "primary_color": "#773CBD",
                "font_one": "helvetica",
                "font_two": "calibri",
            },
        )

    def test_update_organization_appearance(self):
        self.client.force_login(self.super_admin)
        new_appearance = {
            "sidebar_text": "#773CBD",
            "button_text": "#773CBD",
            "sidebar_color": "#773CBD",
            "primary_color": "#773CBD",
            "font_one": "helvetica",
            "font_two": "arial",
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

    def test_add_organization_health_networks(self):
        self.client.force_login(self.fse_admin)
        new_health_network = factories.HealthNetworkFactory()
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/health_networks/",
            data={"health_networks": [new_health_network.id]},
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            models.OrganizationHealthNetwork.objects.filter(
                organization=self.organization, health_network=new_health_network
            ).count(),
            1,
        )

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

    def test_user_deactivate(self):
        for user in [self.user_admin]:
            self.client.force_login(user)

            new_user = factories.UserFactory(
                is_active=True, organizations=[self.organization]
            )
            response = self.client.patch(
                "/api/users/deactivate/", data={"users": [new_user.id]}
            )
            self.assertEqual(response.status_code, 200)
            new_user.refresh_from_db()
            self.assertEqual(new_user.is_active, False)

    def test_user_upsert_insert(self):
        self.client.force_login(self.super_admin)
        user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@doe.com",
            "phone": "+19876543210",
            "role": models.Membership.Role.FSE,
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
            "/api/users/",
            data=user_data,
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
            "role": models.Membership.Role.FSE_ADMIN,
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


class SiteTestCase(BaseTestCase):
    def test_list_systems(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get(f"/api/sites/{self.site.id}/systems/")
            self.assertEqual(len(response.json()), 1)


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
                "ids": [self.system.id],
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            len(models.Seat.objects.filter(organization=self.organization))
            <= self.organization.number_of_seats
        )
