import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from core import utils


class Command(BaseCommand):
    help = "Fetch CradlePoint routers location"

    @transaction.atomic
    def handle(self, *args, **options):
        response = requests.get(
            url=f"{utils.CRADLEPOINT_API_URL}/routers",
            headers=utils.CRADLEPOINT_REQUEST_HEADERS,
        )
        for router in response.json()["data"]:
            location_url = router["last_known_location"]
            if location_url:
                location_request = requests.get(
                    url=location_url, headers=utils.CRADLEPOINT_REQUEST_HEADERS
                )
                location = location_request.json()
                utils.post_data_to_influxdb(
                    location["longitude"],
                    location["latitude"],
                    router["name"],
                )
        self.stdout.write(
            self.style.SUCCESS("Successfully posted to Influx.")
        )
