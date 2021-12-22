from django.core.management.base import BaseCommand,CommandError
from django.utils import timezone
import subprocess


from core import models

class Command(BaseCommand):

    def handle(self, *args, **options):
        systems = models.System.objects.filter(connection_monitoring=True)
        for system in systems:
            system.is_online=False
            try:
                subprocess.run(f'ping -c2 {system.ip_address}',shell=True,stdout=subprocess.PIPE,check=True)
                system.is_online=True
                system.last_successful_ping_at = timezone.now()
                self.stdout.write(self.style.SUCCESS(f'Ping Successfull @ {system.ip_address}'))
    
            except subprocess.CalledProcessError:
                self.stdout.write(self.style.ERROR(f'Ping Unsuccessfull @ {system.ip_address}'))
            except subprocess.TimeoutExpired:
                self.stdout.write(self.style.ERROR(f'Timeout Error, Ping Unsuccessfull @ {system.ip_address}'))
            finally:
                system.save()