from core import models
from core.tests.base import BaseTestCase


class ModalityTestCase(BaseTestCase):
    def test_modalities_list(self):
        self.client.force_login(self.super_admin)
        response = self.client.get(
            f"/api/organizations/{self.organization.id}/modalities/"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 2)

    def test_modalitiy_manufacturers_list(self):
        for user in [self.super_admin, self.fse]:
            self.client.force_login(user)
            response = self.client.get(
                f"/api/modalities/{self.modality.id}/manufacturers/"
            )

            self.assertEqual(response.status_code, 200)
            self.assertEqual(
                len(response.json()),
                models.Manufacturer.objects.filter(
                    id__in=models.ProductModel.objects.filter(
                        modality=self.modality
                    ).values_list("product__manufacturer")
                ).count(),
            )
