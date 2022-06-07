from vfse import models
from vfse.tests.base import BaseTestCase


class DocumentsTestCase(BaseTestCase):
    def test_documents_list(self):
        self.client.force_login(self.super_user)
        response = self.client.get("/api/vfse/documents/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_documents_post(self):
        self.client.force_login(self.super_user)
        response = self.client.post(
            "/api/vfse/documents/",
            data={
                "title": "New document",
                "text": "No description",
                "folder": self.folder.id,
                "favorite": True,
                "categories": [self.category.id],
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Document.objects.filter(
                title="New document",
                categories=self.category,
                folder=self.folder,
                favorite=True,
            ).exists()
        )

    def test_documents_retrieve(self):
        self.client.force_login(self.super_user)
        response = self.client.get(f"/api/vfse/documents/{self.document.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            list(response.json().keys()),
            [
                "id",
                "title",
                "text",
                "folder",
                "favorite",
                "categories",
                "document_link",
                "created_by",
            ],
        )

    def test_documents_patch(self):
        self.client.force_login(self.super_user)
        response = self.client.patch(
            f"/api/vfse/documents/{self.document.id}/",
            data={"text": "This is updated text for this docs"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            models.Document.objects.filter(
                title=self.document.title, text="This is updated text for this docs"
            ).count(),
            1,
        )

    def test_folder_delete(self):
        self.client.force_login(self.super_user)
        response = self.client.delete(f"/api/vfse/documents/{self.document.id}/")

        self.assertEqual(response.status_code, 204)
