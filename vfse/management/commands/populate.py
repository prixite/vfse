import random
from django.core.management.base import BaseCommand
from vfse.tests import factories
from django.db import transaction
class Command(BaseCommand):

    @transaction.atomic
    def handle(self, *args, **options):
        factories.CategoryFactory.create_batch(10)      
        factories.DocumentFactory.create_batch(100)  
        self.stdout.write(self.style.SUCCESS('VFSE data generated Successfully'))