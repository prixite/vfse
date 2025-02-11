from django.test import TestCase

from core import models
from core.tests import client
from core.tests import factories as core_app_factories
from vfse.tests import factories


class BaseTestCase(TestCase):
    def setUp(self):
        self.client = client.Client()

        self.super_user = core_app_factories.UserWithPasswordFactory(is_superuser=True)
        self.follower = core_app_factories.UserFactory()
        self.fse_follower = core_app_factories.UserFactory()
        self.topic_owner = core_app_factories.UserFactory()
        self.category = factories.CategoryFactory()
        self.folder = factories.FolderFactory(categories=[self.category])
        self.document = factories.DocumentFactory(
            folder=self.folder,
            created_by=self.super_user,
        )
        self.topic = factories.TopicFactory(
            title="Test Topic",
            description="Test Topic Description",
            user=self.topic_owner,
            followers=[self.follower, self.topic_owner],
        )

        self.comment = factories.CommentFactory(
            topic=self.topic, user=self.follower, comment="This is the first comment"
        )

        self.reply = factories.CommentFactory(
            topic=self.topic,
            user=self.follower,
            comment="This is the first reply",
            parent=self.comment,
        )
        organization = core_app_factories.OrganizationFactory(
            is_default=True,
            name="626",
            number_of_seats=10,
        )

        self.system = core_app_factories.SystemFactory(
            site=core_app_factories.SiteFactory(organization=organization)
        )

        self.work_order = factories.WorkOrderFactory(
            system=core_app_factories.SystemFactory(
                site=core_app_factories.SiteFactory(organization=organization)
            )
        )

        core_app_factories._add_member(
            organization, [self.follower, self.topic_owner], models.Role.FSE_ADMIN
        )
        core_app_factories._add_member(
            organization, [self.fse_follower], models.Role.FSE
        )
