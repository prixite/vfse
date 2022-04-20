from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver

from core import models as core_models
from vfse import models


@receiver(m2m_changed, sender=models.Topic.followers.through)
def topic_activity(sender, instance, action, reverse, model, pk_set, using, **kwargs):
    if action == "post_add":
        users = core_models.User.objects.filter(id__in=pk_set)
        objs = [
            models.RecentActivity(
                user=user,
                topic=instance,
                action=f"started following your topic {instance.title}",
            )
            for user in users
        ]
        models.RecentActivity.objects.bulk_create(objs)


@receiver(post_save, sender=models.Comment)
def comment_activity(sender, instance, created, **kwargs):
    if created:
        models.RecentActivity.objects.create(
            user=instance.user,
            topic=instance.topic,
            action="commented on a topic you follow",
        )
