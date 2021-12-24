from django.core.management.base import BaseCommand
from django.utils import timezone
from icmplib import ping

from core import models


class Command(BaseCommand):
    def handle(self, *args, **options):
        systems = models.System.objects.filter(connection_monitoring=True)

        for system in systems:
            system.is_online = False

            response = ping(address=system.ip_address, count=1, privileged=False)
            if response.is_alive:
                system.is_online = True
                system.last_successful_ping_at = timezone.now()
                self.stdout.write(
                    self.style.SUCCESS(f"Ping Successfull @ {system.ip_address}")
                )
            system.save()
