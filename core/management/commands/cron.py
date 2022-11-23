import requests
from django.core.management.base import BaseCommand
from django.db import transaction

from core import utils


class Command(BaseCommand):
    help = "fetch cradlepoint routers location"

    @transaction.atomic
    def handle(self, *args, **options):
        req = requests.get(
            url=f"{utils.CRADLEPOINT_API_URL}/routers",
            headers=utils.CRADLEPOINT_REQUEST_HEADERS,
        )
        routers_resp = req.json()
        for router in routers_resp["data"]:
            last_known_location = router["last_known_location"]
            if last_known_location:
                loc_req = requests.get(
                    url=last_known_location, headers=utils.CRADLEPOINT_REQUEST_HEADERS
                )
                loc_resp = loc_req.json()
                utils.post_data_to_influxdb(
                    loc_resp["longitude"],
                    loc_resp["latitude"],
                    router["name"],
                )
