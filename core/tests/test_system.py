from core import models
from core.tests import factories
from core.tests.base import BaseTestCase


class SystemTestCase(BaseTestCase):
    def test_list_system_notes(self):
        self.client.force_login(self.super_admin)
        response = self.client.get(f"/api/systems/{self.system.id}/notes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 3)

    def test_create_system_notes(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            f"/api/systems/{self.system.id}/notes/",
            data={
                "system": self.system.id,
                "author": self.super_admin.id,
                "note": "Test Notes",
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(models.Note.objects.filter(note="Test Notes").exists())

    def test_list_system_images(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/api/systems/images/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), models.SystemImage.objects.all().count())

    def test_create_system_images(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            "/api/systems/images/",
            data={"image": "http://example.com/newsystemimage.jpeg"},
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.SystemImage.objects.filter(
                image="http://example.com/newsystemimage.jpeg"
            ).exists()
        )

    def test_list_systems(self):
        for user in [self.super_admin, self.super_manager]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/organizations/{self.organization.id}/systems/"
            )
            self.assertEqual(len(response.json()), 1)

    def test_list_systems_vfse(self):
        self.client.force_login(self.fse)
        models.UserSystem.objects.create(
            user=self.fse,
            system=self.system,
            organization=self.organization,
            read_only=False,
        )
        models.UserSite.objects.create(
            user=self.fse, site=self.site, organization=self.organization
        )
        models.UserModality.objects.create(
            user=self.fse, modality=self.modality, organization=self.organization
        )
        response = self.client.get(
            f"/api/organizations/{self.organization.id}/systems/"
        )
        self.assertEqual(len(response.json()), 1)

    def test_post_system(self):
        self.client.force_login(self.super_admin)

        his_info = {
            "ip": "192.187.23.23",
            "title": "HIS System 1",
            "ae_title": "HS1",
            "port": 2000,
        }
        dicom_info = {
            "ip": "192.0.0.9",
            "title": "Dicom System 1",
            "ae_title": "dS1",
            "port": 2850,
        }
        mri_info = {
            "helium": "High",
            "magnet_pressure": "strong",
        }
        connection_options = {
            "vfse": True,
            "virtual_media_control": False,
            "service_web_browser": False,
            "ssh": False,
        }
        product_model = factories.ProductModelFactory(model="Last model")
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/systems/",
            data={
                "name": "Post System",
                "his_ris_info": his_info,
                "dicom_info": dicom_info,
                "mri_embedded_parameters": mri_info,
                "site": self.site.id,
                "product_model": product_model.id,
                "software_version": "v2",
                "grafana_link": "http://example.com/newsystemimage.jpeg",
                "asset_number": "12452",
                "ip_address": "192.168.23.25",
                "local_ae_title": "new title",
                "connection_options": connection_options,
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.System.objects.filter(name="Post System", site=self.site.id).exists()
        )

    def test_post_system_by_view_only_is_unaccesible(self):
        self.client.force_login(self.view_only)

        his_info = {
            "ip": "192.187.23.23",
            "title": "HIS System 1",
            "ae_title": "HS1",
            "port": 2000,
        }
        dicom_info = {
            "ip": "192.0.0.9",
            "title": "Dicom System 1",
            "ae_title": "dS1",
            "port": 2850,
        }
        mri_info = {
            "helium": "High",
            "magnet_pressure": "strong",
        }
        connection_options = {
            "vfse": True,
            "virtual_media_control": False,
            "service_web_browser": False,
            "ssh": False,
        }
        product_model = factories.ProductModelFactory(model="Last model")
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/systems/",
            data={
                "name": "Post System",
                "his_ris_info": his_info,
                "dicom_info": dicom_info,
                "mri_embedded_parameters": mri_info,
                "site": self.site.id,
                "product_model": product_model.id,
                "software_version": "v2",
                "grafana_link": "http://example.com/newsystemimage.jpeg",
                "asset_number": "12452",
                "ip_address": "192.168.23.25",
                "local_ae_title": "new title",
                "connection_options": connection_options,
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_post_system_min(self):
        self.client.force_login(self.super_admin)

        his_info = {
            "ip": "",
            "title": "",
            "ae_title": "",
            "port": None,
        }
        dicom_info = {
            "ip": "",
            "title": "",
            "ae_title": "",
            "port": None,
        }
        connection_options = {
            "vfse": True,
            "virtual_media_control": False,
            "service_web_browser": False,
            "ssh": False,
        }
        product_model = factories.ProductModelFactory(model="Last model")
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/systems/",
            data={
                "name": "Post System",
                "his_ris_info": his_info,
                "dicom_info": dicom_info,
                "ip_address": "",
                "site": self.site.id,
                "product_model": product_model.id,
                "connection_options": connection_options,
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.System.objects.filter(name="Post System", site=self.site.id).exists()
        )

    def test_post_system_partial(self):
        self.client.force_login(self.super_admin)
        connection_options = {
            "vfse": True,
            "virtual_media_control": False,
            "service_web_browser": False,
            "ssh": False,
        }
        product_model = factories.ProductModelFactory(model="Last model")
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/systems/",
            data={
                "name": "Post System",
                "site": self.site.id,
                "product_model": product_model.id,
                "software_version": "v2",
                "grafana_link": "http://example.com/newsystemimage.jpeg",
                "asset_number": "12452",
                "local_ae_title": "new title",
                "connection_options": connection_options,
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.System.objects.filter(name="Post System", site=self.site.id).exists()
        )

    def test_post_duplicate_system(self):
        self.client.force_login(self.super_admin)

        his_info = {
            "ip": "192.187.23.23",
            "title": "HIS System 1",
            "ae_title": "HS1",
            "port": 2000,
        }
        dicom_info = {
            "ip": "192.0.0.9",
            "title": "Dicom System 1",
            "ae_title": "dS1",
            "port": 2850,
        }
        mri_info = {
            "helium": "High",
            "magnet_pressure": "strong",
        }
        connection_options = {
            "vfse": True,
            "virtual_media_control": False,
            "service_web_browser": False,
            "ssh": False,
        }
        product_model = factories.ProductModelFactory(model="Last model")
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/systems/",
            data={
                "name": self.system.name,
                "his_ris_info": his_info,
                "dicom_info": dicom_info,
                "mri_embedded_parameters": mri_info,
                "site": self.site.id,
                "product_model": product_model.id,
                "software_version": "v2",
                "grafana_link": "http://example.com/newsystemimage.jpeg",
                "asset_number": "12452",
                "ip_address": "192.168.23.25",
                "local_ae_title": "new title",
                "connection_options": connection_options,
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_update_system(self):
        self.client.force_login(self.super_admin)
        mri_info = {
            "helium": "Highest",
            "magnet_pressure": "Strongest",
        }
        response = self.client.patch(
            f"/api/organizations/{self.organization.id}/systems/{self.system.id}/",
            data={
                "name": "Post System",
                "mri_embedded_parameters": mri_info,
                "software_version": "v3",
                "asset_number": "1245255",
                "ip_address": "192.168.23.8",
                "local_ae_title": "Updated Title",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            models.System.objects.filter(
                name="Post System",
                mri_embedded_parameters=mri_info,
                software_version="v3",
                asset_number="1245255",
            ).exists()
        )

    def test_update_system_invalid(self):
        self.client.force_login(self.super_admin)
        system = factories.SystemFactory(name="New System", site=self.site)
        response = self.client.patch(
            f"/api/organizations/{self.organization.id}/systems/{self.system.id}/",
            data={
                "name": system.name,
                "site": self.site.id,
                "software_version": "v3",
                "asset_number": "1245255",
                "ip_address": "192.168.23.8",
                "local_ae_title": "Updated Title",
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_update_system_remove_seat(self):
        self.client.force_login(self.super_admin)
        connection_options = {
            "vfse": False,
            "virtual_media_control": False,
            "service_web_browser": False,
            "ssh": False,
        }
        response = self.client.patch(
            f"/api/organizations/{self.organization.id}/systems/{self.system.id}/",
            data={
                "name": "Post System",
                "connection_options": connection_options,
                "software_version": "v3",
                "asset_number": "1245255",
                "ip_address": "192.168.23.8",
                "local_ae_title": "Updated Title",
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["connection_options"], connection_options)

    def test_system_notes_patch(self):
        self.client.force_login(self.fse)
        note = factories.SystemNoteFactory(system=self.system, author=self.fse)
        new_sentence = "This is the new sentence"
        response = self.client.patch(
            f"/api/notes/{note.id}/",
            data={
                "note": new_sentence,
            },
        )

        note.refresh_from_db()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(note.note, new_sentence)

    def test_system_notes_delete(self):
        self.client.force_login(self.super_admin)
        response = self.client.delete(f"/api/notes/{self.note.id}/")

        self.assertEqual(response.status_code, 204)

    def test_delete_unaccesible_system(self):
        self.client.force_login(self.super_admin)

        response = self.client.delete(
            f"/api/organizations/{self.organization.id}/systems/999999/"
        )
        self.assertEqual(response.status_code, 404)

        response = self.client.delete("/api/organizations/999999/systems/999999/")
        self.assertEqual(response.status_code, 404)

    def test_add_system_by_end_user_is_unaccesible(self):
        self.client.force_login(self.end_user)
        his_info = {
            "ip": "192.187.23.23",
            "title": "HIS System 1",
            "ae_title": "HS1",
            "port": 2000,
        }
        dicom_info = {
            "ip": "192.0.0.9",
            "title": "Dicom System 1",
            "ae_title": "dS1",
            "port": 2850,
        }
        mri_info = {
            "helium": "High",
            "magnet_pressure": "strong",
        }
        connection_options = {
            "vfse": True,
            "virtual_media_control": False,
            "service_web_browser": False,
            "ssh": False,
        }
        product_model = factories.ProductModelFactory(model="Last model")
        response = self.client.post(
            f"/api/organizations/{self.organization.id}/systems/",
            data={
                "name": "Post System",
                "his_ris_info": his_info,
                "dicom_info": dicom_info,
                "mri_embedded_parameters": mri_info,
                "site": self.site.id,
                "product_model": product_model.id,
                "software_version": "v2",
                "grafana_link": "http://example.com/newsystemimage.jpeg",
                "asset_number": "12452",
                "ip_address": "192.168.23.25",
                "local_ae_title": "new title",
                "connection_options": connection_options,
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_delete_system_by_end_user_is_unaccesible(self):
        self.client.force_login(self.end_user)

        response = self.client.delete(
            f"/api/organizations/{self.organization.id}/systems/999999/"
        )
        self.assertEqual(response.status_code, 403)

    def test_update_system_by_end_user_is_unaccesible(self):
        self.client.force_login(self.end_user)
        mri_info = {
            "helium": "Highest",
            "magnet_pressure": "Strongest",
        }
        response = self.client.patch(
            f"/api/organizations/{self.organization.id}/systems/{self.system.id}/",
            data={
                "name": "Post System",
                "mri_embedded_parameters": mri_info,
                "software_version": "v3",
                "asset_number": "1245255",
                "ip_address": "192.168.23.8",
                "local_ae_title": "Updated Title",
            },
        )
        self.assertEqual(response.status_code, 403)


class SystemSSHTestCase(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.token_user = self.super_admin
        self.token_user.is_remote_user = True
        self.token_user.save()
        models.Token.objects.create(user=self.token_user)

    def test_ssh_connection_request_permission_denied(self):
        self.client.force_token_login(self.super_admin)
        response = self.client.get(
            f"/api/systems/{self.system.id}/ssh_password/",  # noqa
        )
        self.assertEqual(response.status_code, 404)

    def test_ssh_connection_request(self):
        self.client.force_token_login(self.token_user)
        self.system.connection_options["ssh"] = True
        self.system.save()
        response = self.client.get(
            f"/api/systems/{self.system.id}/ssh_password/",  # noqa
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("ssh_password", response.json().keys())
