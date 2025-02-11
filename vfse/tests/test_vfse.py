from vfse import models
from vfse.tests import factories
from vfse.tests.base import BaseTestCase


class VfseTestCase(BaseTestCase):
    def test_folder_list(self):
        self.client.force_login(self.super_user)

        response = self.client.get("/api/vfse/folders/")
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_folder_post(self):
        self.client.force_login(self.super_user)
        response = self.client.post(
            "/api/vfse/folders/",
            data={
                "name": "Conspiracies",
                "categories": [self.category.id],
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Folder.objects.filter(
                name="Conspiracies", categories=self.category
            ).exists()
        )

    def test_folder_delete(self):
        self.client.force_login(self.super_user)
        models.Document.objects.all().delete()
        response = self.client.delete(f"/api/vfse/folders/{self.folder.id}/")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(models.Folder.objects.filter(id=self.folder.id).exists())

    def test_folder_patch(self):
        self.client.force_login(self.super_user)
        new_category = factories.CategoryFactory()
        response = self.client.patch(
            f"/api/vfse/folders/{self.folder.id}/",
            data={"categories": [new_category.id]},
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            models.Folder.objects.filter(categories__in=[new_category]).exists()
        )

    def test_document_list(self):
        self.client.force_login(self.super_user)

        response = self.client.get("/api/vfse/documents/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_document_post(self):
        self.client.force_login(self.super_user)
        text = factories.fake.text()
        response = self.client.post(
            "/api/vfse/documents/",
            data={
                "title": factories.fake.sentence(),
                "text": text,
                "folder": self.folder.id,
                "categories": [factories.CategoryFactory().id],
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Document.objects.filter(
                text=text, folder=self.folder, created_by=self.super_user
            ).exists()
        )

    def test_document_delete(self):
        self.client.force_login(self.super_user)
        response = self.client.delete(f"/api/vfse/documents/{self.document.id}/")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(models.Document.objects.filter(id=self.document.id).exists())

    def test_document_patch(self):
        self.client.force_login(self.super_user)
        new_text = factories.fake.text()
        response = self.client.patch(
            f"/api/vfse/documents/{self.document.id}/", data={"text": new_text}
        )

        self.assertEqual(response.status_code, 200)
        self.document.refresh_from_db()
        self.assertEqual(self.document.text, new_text)
