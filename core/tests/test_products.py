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
