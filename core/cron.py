import time

import requests
from django_cron import CronJobBase, Schedule

from core import utils


class CradlePointJob(CronJobBase):
    RUN_EVERY_MINS = 5  # every 5 minutes
    RETRY_AFTER_FAILURE_MINS = 1
    schedule = Schedule(
        run_every_mins=RUN_EVERY_MINS, retry_after_failure_mins=RETRY_AFTER_FAILURE_MINS
    )
    code = "core.cradle_point_routers_job"  # a unique code

    def do(self):
        req = requests.get(url=f"{utils.url}/routers", headers=utils.headers)
        routers_resp = req.json()
        for router in routers_resp["data"]:
            last_known_location = router["last_known_location"]
            if last_known_location:
                loc_req = requests.get(url=last_known_location, headers=utils.headers)
                loc_resp = loc_req.json()
                utils.post_data_to_influxdb(
                    loc_resp["longitude"],
                    loc_resp["latitude"],
                    router["name"],
                )
                time.sleep(1)
