import time

from django.core.management.base import BaseCommand
from django.utils import timezone
from icmplib import ping

from core import models


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("sleep_time", nargs="?", type=int, default=3)

    def handle(self, *args, **options):
        while True:
            self.stdout.write(
                self.style.WARNING("-------Strating PING Iteration------")
            )
            self.perform_ping(*args, **options)
            self.stdout.write(
                self.style.WARNING(
                    f'----Going to sleep for {options["sleep_time"]} seconds----\n\n'
                )
            )
            time.sleep(options["sleep_time"])

    def perform_ping(self, *args, **options):
        systems = models.System.objects.filter(connection_monitoring=True)
        for system in systems:
            system.is_online = False

            response = ping(address=system.ip_address, count=1)
            if response.is_alive:
                system.is_online = True
                system.last_successful_ping_at = timezone.now()
                self.stdout.write(
                    self.style.SUCCESS(f"Ping Successfull @ {system.ip_address}")
                )
            system.save(update_fields=["is_online", "last_successful_ping_at"])
