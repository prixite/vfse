from core import models
from core.tests import factories
from core.tests.base import BaseTestCase


class ManufacturerTestCase(BaseTestCase):
    def test_manufacturer_list(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/api/manufacturers/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            len(response.json()), models.Manufacturer.objects.all().count()
        )

    def test_manufacturer_post(self):
        self.client.force_login(self.super_admin)
        response = self.client.post(
            "/api/manufacturers/",
            data={"name": "Philips", "image": factories.ManufacturerImageFactory().id},
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(
            models.Manufacturer.objects.filter(name="Philips").exists(), True
        )
