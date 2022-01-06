import re
from core import models
from core.tests import factories

from core.tests.base import BaseTestCase


class DataAttribtueTestCase(BaseTestCase):
    @staticmethod
    def extract_data_attributes(content):
        result = re.search(r".*<body\W+(.+?)>.*", content, re.DOTALL)

        attributes = {}
        for attribute in result.group(1).split():
            key, value = attribute.split("=")
            attributes[key] = value.replace('"', "")

        return attributes

    def test_super_admin_flags(self):
        self.client.force_login(self.super_admin)

        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            self.extract_data_attributes(response.content.decode()),
            {
                "data-flags": "appearance,documentation,modality,organization,user,vfse",  # noqa
            },
        )
    
    def test_post_site_system(self):
        self.client.force_login(self.super_admin)

        his_info = {
            "ip": "192.187.23.23",
            "title": "HIS System 1",
            "ae_title": "HS1",
            "port": 2000,
        }
        dicom_info = {
            "ip": "192.0.0.9",
            "title": "Dicom System 1",
            "ae_title": "dS1",
            "port": 2850,
        }
        mri_info = {
            "helium": "High",
            "magnet_pressure": "strong",
        }
        product_model = factories.ProductModelFactory(model='Last model')
        response = self.client.post(f'/api/sites/{self.site.id}/systems/',
        data={
            "name":"Post System",
            "his_ris_info":his_info,
            "dicom_info":dicom_info,
            "mri_embedded_parameters":mri_info,
            'site':self.site.id,
            'product_model':product_model.id,
            "software_version":'v2',
            'asset_number':'12452',
            "ip_address":"192.168.23.25",
            "local_ae_title":'new title'
        })

        self.assertEqual(response.status_code,201)
        self.assertTrue(models.System.objects.filter(name='Post System',site=self.site.id).exists())
    
    def test_update_site_system(self):
        self.client.force_login(self.super_admin)
        mri_info = {
            "helium": "Highest",
            "magnet_pressure": "Strongest",
        }
        response = self.client.patch(f'/api/sites/{self.site.id}/systems/{self.system.id}/',
        data={
            "name":"Post System",
            "mri_embedded_parameters":mri_info,
            "software_version":'v3',
            'asset_number':'1245255',
            "ip_address":"192.168.23.8",
            "local_ae_title":'Updated Title'
        })
        self.assertEqual(response.status_code,200)
        self.assertTrue(models.System.objects.filter(name='Post System',mri_embedded_parameters=mri_info,software_version='v3',asset_number='1245255').exists())