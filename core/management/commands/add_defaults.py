from django.core.management.base import BaseCommand
from django.db import transaction

from core.tests import factories


class Command(BaseCommand):
    help = "Add defaults"

    @transaction.atomic
    def handle(self, *args, **options):

        factories.UserWithPasswordFactory(
            is_superuser=True, is_staff=True, username="super-admin@vfse.com"
        )

        factories.OrganizationFactory(
            is_default=True,
            name="626",
            number_of_seats=10,
        )

        self.stdout.write(self.style.SUCCESS("Successfully generated data."))
