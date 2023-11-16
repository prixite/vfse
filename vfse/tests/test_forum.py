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
        self.client.force_login(self.follower)
        response = self.client.patch(
            f"/api/vfse/topics/{self.topic.id}/follow/", data={"follow": True}
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            models.Topic.objects.filter(
                id=self.topic.id, followers=self.follower
            ).exists()
        )

        response = self.client.patch(
            f"/api/vfse/topics/{self.topic.id}/follow/", data={"follow": False}
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(
            models.Topic.objects.filter(
                id=self.topic.id, followers=self.follower
            ).exists()
        )

        self.assertEqual(
            response.json(), {}
        )  # TODO: what response should be returned ?

    def test_topic_query(self):
        self.client.force_login(self.super_user)
        factories.TopicFactory(
            title="Travelling to Space",
            description="The project is to enable space travel for general public",
            user=self.topic_owner,
        )
        # Topic Title search
        response = self.client.get("/api/vfse/topics/?query=space")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

        # Topic Description search
        response = self.client.get("/api/vfse/topics/?query=public")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_topic_list(self):
        self.client.force_login(self.super_user)
        response = self.client.get("/api/vfse/topics/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_topic_retrieve(self):
        self.client.force_login(self.super_user)
        response = self.client.get(f"/api/vfse/topics/{self.topic.id}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            list(response.json().keys()),
            [
                "id",
                "user",
                "title",
                "description",
                "followers",
                "image",
                "categories",
                "reply_email_notification",
                "number_of_followers",
                "number_of_comments",
                "created_at",
                "updated_at",
            ],
        )

    def test_topic_delete(self):
        self.client.force_login(self.super_user)
        response = self.client.delete(f"/api/vfse/topics/{self.topic.id}/")

        self.assertEqual(response.status_code, 204)

    def test_topic_post(self):
        self.client.force_login(self.super_user)
        response = self.client.post(
            "/api/vfse/topics/",
            data={
                "title": "New Topic",
                "description": "This topic has no description",
                "image": "http://example.com/image.jpeg",
                "categories": [self.category.id],
                "reply_email_notification": False,
            },
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Topic.objects.filter(
                title="New Topic", reply_email_notification=False
            ).exists()
        )

    def test_topic_patch(self):
        self.client.force_login(self.super_user)
        response = self.client.patch(
            f"/api/vfse/topics/{self.topic.id}/",
            data={
                "title": "Changed Topic",
                "reply_email_notification": True,
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            models.Topic.objects.filter(
                title="Changed Topic", reply_email_notification=True
            ).exists()
        )

    def test_topics_popular_list(self):
        self.client.force_login(self.super_user)
        response = self.client.get("/api/vfse/topics/popular/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_topic_activity(self):
        self.client.force_login(self.super_user)
        response = self.client.get("/api/vfse/user/activity/")

        self.assertEqual(response.status_code, 200)


class CommentsTestCase(BaseTestCase):
    def test_comment_list(self):
        self.client.force_login(self.super_user)
        response = self.client.get(f"/api/vfse/topics/{self.topic.id}/comments/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_comment_post(self):
        self.client.force_login(self.super_user)
        response = self.client.post(
            f"/api/vfse/topics/{self.topic.id}/comments/",
            data={"comment": "This is another random comment"},
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Comment.objects.filter(
                topic=self.topic.id, comment="This is another random comment"
            ).exists()
        )


class RepliesTestCase(BaseTestCase):
    def test_replies_list(self):
        self.client.force_login(self.super_user)
        response = self.client.get(f"/api/vfse/comments/{self.comment.id}/replies/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_comment_post(self):
        self.client.force_login(self.super_user)
        response = self.client.post(
            f"/api/vfse/comments/{self.comment.id}/replies/",
            data={"comment": "This is another random comment"},
        )

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.Comment.objects.filter(
                topic=self.topic.id,
                comment="This is another random comment",
                parent=self.comment,
            ).exists()
        )


class DashboardTestCase(BaseTestCase):
    def test_dashboard_home(self):
        self.client.force_login(self.super_user)
        response = self.client.get("/api/vfse/dashboard/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            list(response.json().keys()),
            [
                "system_count",
                "online_system_count",
                "offline_system_count",
                "last_month_logged_in_user",
                "work_order",
            ],
        )


class WorkOrderTestCase(BaseTestCase):
    def test_workorders_list(self):
        self.client.force_login(self.super_user)
        response = self.client.get("/api/vfse/workorders/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)

    def test_workorders_post(self):
        self.client.force_login(self.super_user)
        response = self.client.post(
            "/api/vfse/workorders/",
            data={
                "system": self.system.id,
                "description": "There is no description",
                "work_started": False,
                "work_completed": False,
            },
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            models.WorkOrder.objects.filter(
                system_id=self.system.id, description="There is no description"
            ).exists()
        )
