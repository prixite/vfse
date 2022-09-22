from core import models
from core.tests import factories
from core.tests.base import BaseTestCase


class ProductTestCase(BaseTestCase):
    def test_products_list(self):
        self.client.force_login(self.super_admin)

        response = self.client.get("/api/products/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_product_post(self):
        self.client.force_login(self.super_admin)
        manufacuturer_obj = factories.ManufacturerFactory(name="New manufactuere")
        response = self.client.post(
            "/api/products/",
            data={
                "name": "New Product",
                "manufacturer": manufacuturer_obj.id,
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Product.objects.filter(
                name="New Product", manufacturer=manufacuturer_obj
            ).exists
        )

    def test_product_delete(self):
        self.client.force_login(self.super_admin)
        response = self.client.delete(f"/api/products/{self.product.id}/")
        self.assertEqual(response.status_code, 204)
        self.assertFalse(models.Product.objects.filter(id=self.product.id).exists())

    def test_product_update(self):
        self.client.force_login(self.super_admin)
        response = self.client.patch(
            f"/api/products/{self.product.id}/",
            data={
                "name": "Latest Product",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.product.refresh_from_db()
        self.assertEqual(self.product.name, "Latest Product")

    def test_list_product_models(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/api/products/models/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            len(response.json()),
            models.ProductModel.objects.all().count(),
        )

    def test_post_proudct_model(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            "/api/products/models/",
            data={
                "model": "test model",
                "product": self.product.id,
                "modality": self.modality.id,
                "documentation": {"url": "http://example.com/doc.pdf"},
            },
        )
        self.assertEqual(response.status_code, 201),
        self.assertTrue(models.ProductModel.objects.filter(model="test model").exists())

    def test_delete_product_model(self):
        self.client.force_login(self.super_admin)
        response = self.client.delete(f"/api/products/models/{self.product_model.id}/")
        self.assertEqual(response.status_code, 204)

    def test_delete_product_model_by_view_only_is_unaccesible(self):
        self.client.force_login(self.view_only)
        response = self.client.delete(f"/api/products/models/{self.product_model.id}/")
        self.assertEqual(response.status_code, 403)

    def test_update_product_model(self):
        self.client.force_login(self.super_admin)

        response = self.client.patch(
            f"/api/products/models/{self.product_model.id}/",
            data={
                "model": "Updated model",
                "documentation": {"url": "http://example.com/doc_new.pdf"},
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            models.ProductModel.objects.filter(
                model="Updated model",
                documentation__url="http://example.com/doc_new.pdf",
            ).exists()
        )

    def test_update_product_model_by_view_only_is_unaccesible(self):
        self.client.force_login(self.view_only)
        response = self.client.patch(
            f"/api/products/models/{self.product_model.id}/",
            data={
                "model": "Updated model",
                "documentation": {"url": "http://example.com/doc_new.pdf"},
            },
        )

        self.assertEqual(response.status_code, 403)

    def test_add_product_name_by_end_user_is_unaccesible(self):
        self.client.force_login(self.end_user)
        manufacuturer_obj = factories.ManufacturerFactory(name="New manufactuere")
        response = self.client.post(
            "/api/products/",
            data={
                "name": "product-36",
                "manufacturer": manufacuturer_obj.id,
            },
        )
        self.assertEqual(response.status_code, 403)

    def test_post_proudct_model_by_end_user_is_unaccesible(self):
        self.client.force_login(self.end_user)
        response = self.client.post(
            "/api/products/models/",
            data={
                "model": "test model",
                "product": self.product.id,
                "modality": self.modality.id,
                "documentation": {"url": "http://example.com/doc.pdf"},
            },
        )
        self.assertEqual(response.status_code, 403)
