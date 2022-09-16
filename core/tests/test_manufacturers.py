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

    def test_manufacturer_post_by_end_user_is_unaccesible(self):
        self.client.force_login(self.end_user)
        response = self.client.post(
            "/api/manufacturers/", data={"name": "manufacturers-36"}
        )
        self.assertEqual(response.status_code, 403)

    def test_list_manufacturer_images(self):
        self.client.force_login(self.super_admin)
        response = self.client.get("/api/manufacturers/images/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            len(response.json()), models.ManufacturerImage.objects.all().count()
        )

    def test_create_manufacturer_images(self):
        self.client.force_login(self.super_admin)

        response = self.client.post(
            "/api/manufacturers/images/",
            data={"image": "http://example.com/newimage.jpeg"},
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.ManufacturerImage.objects.filter(
                image="http://example.com/newimage.jpeg"
            ).exists()
        )
