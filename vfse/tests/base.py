from django.test import TestCase

from core.tests import client
from core.tests import factories as core_app_factories
from vfse.tests import factories


class BaseTestCase(TestCase):
    def setUp(self):
        self.client = client.Client()

        self.user = core_app_factories.UserWithPasswordFactory()
        self.category = factories.CategoryFactory()
        self.folder = factories.FolderFactory(categories=[self.category])
        self.document = factories.DocumentFactory(folder=self.folder)
