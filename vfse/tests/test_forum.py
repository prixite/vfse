from core.tests import factories as core_factories
from vfse import models
from vfse.tests import factories
from vfse.tests.base import BaseTestCase


class TopicTestCase(BaseTestCase):
    def test_follower_and_comments_count(self):
        self.client.force_login(self.super_user)
        factories.CommentFactory.create_batch(5, topic=self.topic, user=self.follower)
        response = self.client.get(f"/api/vfse/topics/{self.topic.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["number_of_followers"], 2)
        self.assertEqual(response.json()["number_of_comments"], 6)

    def test_follow_unfollow_topic(self):
        follower = core_factories.UserFactory()
        self.client.force_login(follower)

        response = self.client.patch(
            f"/api/vfse/topics/{self.topic.id}/follow/", data={"follow": True}
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            models.Topic.objects.filter(id=self.topic.id, followers=follower).exists()
        )

        response = self.client.patch(
            f"/api/vfse/topics/{self.topic.id}/follow/", data={"follow": False}
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(
            models.Topic.objects.filter(id=self.topic.id, followers=follower).exists()
        )

        self.assertEqual(
            response.json(), {}
        )  # TODO: what response should be returned ?
