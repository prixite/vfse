from django.test import TestCase

from vfse.tests import factories
from core.tests import client,factories as core_app_factories
class BaseTestCase(TestCase):
    def setUp(self):
        self.client = client.Client()

        self.user = core_app_factories.UserWithPasswordFactory()
        self.category = factories.CategoryFactory()
        self.folder = self.category.categories.first()
        self.document = factories.DocumentFactory(folder=self.folder)