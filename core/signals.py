from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver

from core import models


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile(
    # can't change name of sender variable
    sender,  # pylint: disable=unused-argument
    instance=None,
    created=False,
    **kwargs,
):
    if created:
        models.Profile.objects.create(user=instance)
