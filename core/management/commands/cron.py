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
            last_known_location = router["last_known_location"]
            if last_known_location:
                location_request = requests.get(
                    url=last_known_location, headers=utils.CRADLEPOINT_REQUEST_HEADERS
                )
                location = location_request.json()
                utils.post_data_to_influxdb(
                    location["longitude"],
                    location["latitude"],
                    router["name"],
                )
