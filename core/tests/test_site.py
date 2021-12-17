import re

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
