import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from core import models, utils


class Command(BaseCommand):
    help = "Fetch CradlePoint routers location"

    @transaction.atomic
    def handle(self, *args, **options):
        offset = 0
        next_page = True
        while next_page:
            response = requests.get(
                url=f"{utils.CRADLEPOINT_API_URL}/locations/?offset={offset}",
                headers=utils.CRADLEPOINT_REQUEST_HEADERS,
            )
            routers_location_response = response.json()
            routers_location_list = routers_location_response["data"]

            for location in routers_location_list:
                router_request = requests.get(
                    url=location["router"], headers=utils.CRADLEPOINT_REQUEST_HEADERS
                )
                router = router_request.json()
                try:
                    system = models.System.objects.get(name=router["name"])
                    models.RouterLocation.objects.create(
                        system=system,
                        long=location["latitude"],
                        lat=location["longitude"],
                    )
                except Exception as e:
                    self.stdout.write(self.style.ERROR(e))
                utils.post_gps_data_to_influxdb(
                    location["longitude"],
                    location["latitude"],
                    router["name"],
                    router["state"],
                )
            next_page = bool(routers_location_response["meta"]["next"])  # noqa
            offset += 20  # fetch next 20 items

        self.stdout.write(self.style.SUCCESS("Successfully posted to Influx."))
