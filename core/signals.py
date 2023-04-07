from django.conf import settings
from django.contrib.auth.signals import user_logged_in
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
        models.Profile.objects.create(
            user=instance,
        )


@receiver(user_logged_in)
def use_one_time_login(sender, request, user, **kwargs):
    if user.profile.is_one_time and not user.profile.one_time_complete:
        user.profile.one_time_complete = True
        user.profile.save()
