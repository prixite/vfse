import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from core import utils


class Command(BaseCommand):
    help = "Fetch CradlePoint routers location"

    @transaction.atomic
    def handle(self, *args, **options):
        offset = 0
        while True:
            response = requests.get(
                url=f"{utils.CRADLEPOINT_API_URL}/routers/?offset={offset}",
                headers=utils.CRADLEPOINT_REQUEST_HEADERS,
            )
            router_response = response.json()
            if not router_response["meta"]["next"]:  # check for next page
                break

            offset += 20  # fetch next 20 items
            router_list = router_response["data"]

            for router in router_list:
                location_url = router["last_known_location"]
                if location_url:
                    location_request = requests.get(
                        url=location_url, headers=utils.CRADLEPOINT_REQUEST_HEADERS
                    )
                    location = location_request.json()
                    utils.post_gps_data_to_influxdb(
                        location["longitude"],
                        location["latitude"],
                        router["name"],
                        router["state"],
                    )

        self.stdout.write(self.style.SUCCESS("Successfully posted to Influx."))
