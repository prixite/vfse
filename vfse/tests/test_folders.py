from vfse import models
from vfse.tests import factories
from vfse.tests.base import BaseTestCase


class FolderTestCase(BaseTestCase):
    def test_folders_list(self):
        self.client.force_login(self.super_user)
        response = self.client.get("/api/vfse/folders/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_folders_post(self):
        self.client.force_login(self.super_user)
        response = self.client.post(
            "/api/vfse/folders/",
            data={"name": "New Folder", "categories": [self.category.id]},
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Folder.objects.filter(
                name="New Folder", categories=self.category
            ).exists()
        )

    def test_folders_retrieve(self):
        self.client.force_login(self.super_user)
        response = self.client.get(f"/api/vfse/folders/{self.folder.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            list(response.json().keys()), ["id", "name", "categories", "documents"]
        )

    def test_folders_patch(self):
        self.client.force_login(self.super_user)
        new_category = factories.CategoryFactory()
        response = self.client.patch(
            f"/api/vfse/folders/{self.category.id}/",
            data={"name": "Updated Name", "categories": [new_category.id]},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            models.Folder.objects.filter(
                name="Updated Name", categories__in=[new_category.id, self.category.id]
            ).count(),
            1,
        )

    def test_folder_delete(self):
        self.client.force_login(self.super_user)
        response = self.client.delete(f"/api/vfse/folders/{self.folder.id}/")

        self.assertEqual(response.status_code, 204)
