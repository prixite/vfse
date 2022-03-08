from django.core.management.base import BaseCommand

from core import models


class Command(BaseCommand):
    def handle(self, *args, **options):
        user, _ = models.User.objects.get_or_create(
            is_request_user=True,
        )
        token, _ = models.Token.objects.get_or_create(user=user)
        return token.key
