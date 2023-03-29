from app import settings
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

    def test_create_customer_organization_by_view_only_is_unaccesible(self):
        self.client.force_login(self.view_only)
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
        self.assertEqual(response.status_code, 403)

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

    def test_site_list_non_super_users(self):
        for user in [self.customer_admin]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/sites/"
            )
            self.assertEqual(len(response.json()), 1)

    def test_user_list(self):
        for user, count in [
            (self.super_admin, 10),
            (self.super_manager, 10),
            (self.user_admin, 10),
        ]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/users/"
            )
            self.assertEqual(len(response.json()), count)

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
            "https://"
            + settings.AWS_STORAGE_BUCKET_NAME
            + ".s3.us-east-2.amazonaws.com/m_vfse-3_preview_rev_1+1.png"
        )  # noqa
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

    def test_update_organization_appearance_by_view_only_is_unaccesible(self):
        self.client.force_login(self.view_only)
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
        self.assertEqual(response.status_code, 403)

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
            "documentation_url": "true",
            "systems": [{"system": self.system.id, "is_read_only": False}],
        }
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/users/",
            data={"memberships": [user_data]},
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            models.UserModality.objects.filter(
                user__username=user_data["email"],
                modality=self.modality,
            ).exists(),
            1,
        )
        self.assertEqual(
            models.UserSite.objects.filter(
                user__username=user_data["email"],
                site=self.site,
            ).exists(),
            1,
        )
        self.assertEqual(
            models.Membership.objects.filter(
                user__username=user_data["email"],
                role=user_data["role"],
                organization=self.organization,
            ).exists(),
            True,
        )
        self.assertEqual(
            models.Profile.objects.get(user__username=user_data["email"]).manager,
            self.customer_admin,
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
            "documentation_url": "true",
            "systems": [{"system": self.system.id, "is_read_only": False}],
        }
        response = self.client.patch(
            f"/api/users/{self.end_user.id}/",
            data=user_data,
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            models.UserModality.objects.filter(user__email=user_data["email"]).count(),
            1,
        )
        self.assertEqual(
            models.UserSite.objects.filter(user__email=user_data["email"]).count(),
            1,
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

    def test_put_health_networks(self):
        self.client.force_login(self.super_admin)
        response = self.client.put(
            f"/api/organizations/{self.other_organization.id}/health_networks/",
            data={
                "health_networks": [
                    {
                        "id": self.health_network.id,
                        "name": self.health_network.name,
                        "appearance": {"logo": "https://picsum.photos/2000"},
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
        self.health_network.refresh_from_db()
        self.assertTrue(
            self.health_network.appearance == {"logo": "https://picsum.photos/2000"}
        )

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

    def test_put_duplicate_health_network(self):
        self.client.force_login(self.super_admin)
        response = self.client.put(
            f"/api/organizations/{self.other_organization.id}/health_networks/",
            data={
                "health_networks": [
                    {
                        "name": self.organization.name,
                        "appearance": {"logo": "https://picsum.photos/200"},
                    }
                ]
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_put_organization_site(self):
        self.client.force_login(self.super_admin)

        response = self.client.get(f"/api/organizations/{self.organization.id}/sites/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        response = self.client.put(
            f"/api/organizations/{self.organization.id}/sites/",
            data={
                "sites": [
                    {
                        "id": self.site.id,
                        "name": "Existing Site",
                        "address": "Milky Way",
                    },
                    {"name": "1nd Test Site", "address": "Milky Way"},
                    {"name": "2nd Test Site", "address": "Coma Cluster"},
                ]
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            models.Site.objects.filter(organization=self.organization).count(),
            3,
        )
        self.site.refresh_from_db()
        self.assertTrue(self.site.name == "Existing Site")

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

    def test_put_duplicate_organization_site(self):
        self.client.force_login(self.super_admin)
        response = self.client.put(
            f"/api/organizations/{self.organization.id}/sites/",
            data={
                "sites": [
                    {"name": "1nd Test Site", "address": "Milky Way"},
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
        self.assertEqual(
            models.Site.objects.filter(
                organization=self.organization, name="1nd Test Site"
            ).count(),
            1,
        )

    def test_put_existing_organization_site(self):
        self.client.force_login(self.super_admin)
        response = self.client.put(
            f"/api/organizations/{self.organization.id}/sites/",
            data={
                "sites": [
                    {"name": self.site.name, "address": "There's no address"},
                ]
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_self_relation_organization_health_network(self):
        self.client.force_login(self.super_admin)
        health_networks = models.OrganizationHealthNetwork.objects.filter(
            organization=self.organization
        ).count()
        response = self.client.put(
            f"/api/organizations/{self.organization.id}/health_networks/",
            data={
                "health_networks": [
                    {
                        "id": self.organization.id,
                        "name": self.organization.name,
                        "appearance": {"logo": "https://picsum.photos/200"},
                    },
                ]
            },
        )
        self.assertTrue(
            health_networks
            == models.OrganizationHealthNetwork.objects.filter(
                organization=self.organization,
            ).count()
        )
        self.assertEqual(response.status_code, 400)

    def test_identical_organization_health_network(self):
        self.client.force_login(self.super_admin)
        response = self.client.put(
            f"/api/organizations/{self.organization.id}/health_networks/",
            data={
                "health_networks": [
                    {
                        "name": "New health network",
                        "appearance": {"logo": "https://picsum.photos/200"},
                    },
                    {
                        "name": "New health network",
                        "appearance": {"logo": "https://picsum.photos/200"},
                    },
                ]
            },
        )
        self.assertTrue(
            models.OrganizationHealthNetwork.objects.filter(
                organization=self.organization,
                health_network__name="New health network",
            ).exists()
        )
        self.assertEqual(
            models.OrganizationHealthNetwork.objects.filter(
                organization=self.organization
            ).count(),
            1,
        )
        self.assertEqual(response.status_code, 200)

    def test_distinct_organization(self):
        self.client.force_login(self.super_admin)

        response = self.client.get(
            f"/api/organizations/exists/?name={str.upper(self.organization.name)}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["ok"])

    def test_put_view_only_health_network(self):
        self.client.force_login(self.view_only)

        response = self.client.put(
            f"/api/organizations/{self.organization.id}/health_networks/",
            data={
                "name": "Latest Health Network",
                "appearance": {
                    "logo": "https://picsum.photos/200",
                },
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_post_view_only_health_network(self):
        self.client.force_login(self.view_only)

        response = self.client.post(
            f"/api/organizations/{self.organization.id}/health_networks/",
            data={
                "name": "Latest Health Network",
                "appearance": {
                    "logo": "https://picsum.photos/200",
                },
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_user_update_verification(self):
        self.client.force_login(self.super_admin)
        site = factories.SiteFactory(organization=self.other_organization)
        modality = factories.ModalityFactory()

        user_data = {
            "meta": {
                "profile_picture": "http://example.com/profilepic.jpg",
                "title": "Mr.",
            },
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@doe.com",
            "phone": "+19876543210",
            "role": models.Role.FSE_ADMIN,
            "manager": self.customer_admin.id,
            "organization": self.organization.id,
            "sites": [site.id],
            "modalities": [modality.id],
            "fse_accessible": "false",
            "audit_enabled": "false",
            "can_leave_notes": "false",
            "is_one_time": "false",
            "view_only": "false",
            "documentation_url": "true",
            "systems": [{"system": self.system.id, "is_read_only": False}],
        }
        response = self.client.patch(f"/api/users/{self.fse.id}/", data=user_data)
        self.assertEqual(response.status_code, 200)
        self.fse.refresh_from_db()
        self.assertDictEqual(self.fse.profile.meta, user_data["meta"])
        self.assertTrue(self.fse.usermodality_set.filter(modality=modality).exists())
        self.assertEqual(self.fse.usermodality_set.all().count(), 1)

        self.assertTrue(self.fse.usersite_set.filter(site=site).exists())
        self.assertEqual(self.fse.usersite_set.all().count(), 1)

    def test_update_user_duplicate_email(self):
        self.client.force_login(self.super_admin)
        user_data = {
            "meta": {
                "profile_picture": "http://example.com/profilepic.jpg",
                "title": "Mr.",
            },
            "first_name": "John",
            "last_name": "Doe",
            "email": self.super_admin.username,
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
            "documentation_url": "true",
        }
        response = self.client.patch(
            f"/api/users/{self.customer_admin.id}/",
            data=user_data,
        )
        self.assertEqual(response.status_code, 400)

    def test_put_organization_duplicate_site(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/sites/",
            data={
                "name": self.site.name,
                "address": "Lahore k qareeb",
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_post_organization_duplicate_sites(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/sites/",
            data={
                "name": self.site.name,
                "address": "Lahore k qareeb",
            },
        )

        self.assertEqual(response.status_code, 400)

    def test_update_duplicate_organization(self):
        self.client.force_login(self.super_admin)
        response = self.client.patch(
            f"/api/organizations/{self.default_organization.id}/",
            data={
                "name": self.other_organization.name,
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_post_duplicate_health_network(self):
        self.client.force_login(self.super_admin)

        response = self.client.post(
            f"/api/organizations/{self.organization.id}/health_networks/",
            data={
                "name": self.health_network.name,
                "appearance": {
                    "logo": "https://picsum.photos/200",
                },
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_post_duplicate_user(self):
        self.client.force_login(self.super_admin)
        user_data = {
            "meta": {
                "profile_picture": "http://example.com/profilepic.jpg",
                "title": "Mr.",
            },
            "first_name": "John",
            "last_name": "Doe",
            "email": self.user_admin.username,
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
            "documentation_url": "true",
        }
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/users/",
            data={"memberships": [user_data]},
        )
        self.assertEqual(response.status_code, 400)

    def test_update_user_verification(self):
        self.client.force_login(self.super_admin)
        user_data = {
            "meta": {
                "profile_picture": "http://example.com/profilepic.jpg",
                "title": "Mr.",
            },
            "first_name": "John",
            "last_name": "Doe",
            "email": self.customer_admin.username,
            "phone": "+19876543210",
            "role": models.Role.FSE,
            "manager": self.fse_admin.id,
            "organization": self.organization.id,
            "sites": [self.site.id],
            "modalities": [self.modality.id],
            "fse_accessible": "false",
            "audit_enabled": "false",
            "can_leave_notes": "false",
            "is_one_time": "false",
            "view_only": "false",
            "documentation_url": "true",
            "systems": [{"system": self.system.id, "is_read_only": False}],
        }
        user_data["first_name"] = "Amir"
        response = self.client.patch(
            f"/api/users/{self.customer_admin.id}/",
            data=user_data,
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            models.Profile.objects.get(user=self.customer_admin).manager, self.fse_admin
        )

    def test_admin_can_list_organization_associated_sites(self):
        self.client.force_login(self.super_admin)
        factories.HealthNetworkFactory(
            organizations=[self.organization],
            sites=True,
        )
        response = self.client.get(
            f"/api/organizations/{self.organization.id}/associated_sites/"
        )
        self.assertEqual(len(response.json()), 2)

    def test_health_network(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/api/health_networks/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 4)


class VfseTestCase(BaseTestCase):
    def test_list_vfse_systems(self):
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
            f"/api/organizations/{self.other_organization.id}/seats/",
            data={
                "seats": [{"system": self.system.id}],
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            len(models.Seat.objects.filter(organization=self.organization))
            <= self.organization.number_of_seats
        )

    def test_create_vfse_systems_valid_by_view_only_is_unaccesible(self):
        self.client.force_login(self.view_only)
        response = self.client.post(
            f"/api/organizations/{self.other_organization.id}/seats/",
            data={
                "seats": [{"system": self.system.id}],
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_post_duplicate_vfse_system(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/seats/",
            data={
                "seats": [
                    {
                        "system": self.seat.system.id,
                        "organization": self.seat.organization.id,
                    },
                ],
            },
        )
        self.assertEqual(response.status_code, 400)
