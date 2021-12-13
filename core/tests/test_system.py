from core import models
from core.tests.base import BaseTestCase


class SystemTestCase(BaseTestCase):
    def test_list_system_notes(self):
        self.client.force_login(self.super_admin)
        response = self.client.get(f"/api/systems/{self.system.id}/notes/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

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
