import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from core import utils


class Command(BaseCommand):
    help = "Fetch CradlePoint routers location"

    @transaction.atomic
    def handle(self, *args, **options):
        offset = 0

        next_page = True
        while next_page:
            response = requests.get(
                url=f"{utils.CRADLEPOINT_API_URL}/routers/?offset={offset}",
                headers=utils.CRADLEPOINT_REQUEST_HEADERS,
            )
            router_response = response.json()
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

            next_page = bool(router_response["meta"]["next"])  # check for next page
            offset += 20  # fetch next 20 items

        self.stdout.write(self.style.SUCCESS("Successfully posted to Influx."))
