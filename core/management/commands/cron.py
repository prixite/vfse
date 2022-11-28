import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from core import utils


class Command(BaseCommand):
    help = "Fetch CradlePoint routers location"

    @transaction.atomic
    def handle(self, *args, **options):
        next_page = f"{utils.CRADLEPOINT_API_URL}/routers/?offset=0&limit=20"
        while next_page:
            response = requests.get(
                url=next_page,
                headers=utils.CRADLEPOINT_REQUEST_HEADERS,
            )
            router_response = response.json()
            router_list = router_response["data"]

            for router in router_list:
                location_url = router["last_known_location"]
                longitude = latitude = None
                if location_url:
                    location_request = requests.get(
                        url=location_url, headers=utils.CRADLEPOINT_REQUEST_HEADERS
                    )
                    location = location_request.json()
                    longitude = location["longitude"]
                    latitude = location["latitude"]

                utils.post_gps_data_to_influxdb(
                    longitude,
                    latitude,
                    router["name"],
                    router["state"],
                )

            next_page = router_response["meta"]["next"]

        self.stdout.write(self.style.SUCCESS("Successfully posted to Influx."))
