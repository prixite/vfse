from vfse import models
from vfse.tests import factories
from vfse.tests.base import BaseTestCase


class CategoryTestCase(BaseTestCase):
    def test_categories_list(self):
        self.client.force_login(self.super_user)
        response = self.client.get("/api/vfse/categories/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_categories_post(self):
        self.client.force_login(self.super_user)
        response = self.client.post(
            "/api/vfse/categories/",
            data={
                "name": "New Category",
                "color": "Violet",
                "folder": factories.FolderFactory().id,
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Category.objects.filter(name="New Category", color="Violet").exists()
        )

    def test_categories_filter(self):
        self.client.force_login(self.super_user)
        response = self.client.get(f"/api/vfse/categories/?name={self.category.name}")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_categories_retrieve(self):
        self.client.force_login(self.super_user)
        response = self.client.get(f"/api/vfse/categories/{self.category.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            list(response.json().keys()), ["id", "name", "color", "folders"]
        )

    def test_categories_patch(self):
        self.client.force_login(self.super_user)
        response = self.client.patch(
            f"/api/vfse/categories/{self.category.id}/",
            data={
                "name": "Updated Name",
                "color": "New Color",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            models.Category.objects.filter(
                name="Updated Name", color="New Color"
            ).count(),
            1,
        )
