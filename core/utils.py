from django.conf import settings
from influxdb_client import InfluxDBClient

from core import models


def fetch_from_influxdb(system_id):
    city_name = "Plantation"
    system = models.System.objects.get(id=system_id)
    with InfluxDBClient(
        url=settings.INFLUX_DB_URL,
        token=settings.INFLUX_TOKEN,
        org=settings.INFLUX_ORG,
    ) as client:
        query = f"""
            from(bucket: "{settings.INFLUX_BUCKET}")
            |> range(start: -7d)
            |> filter(fn:(r) => r._measurement=="HeLevel" and r._field=="value")
            |> filter(fn:(r) => r["IPAddress"]=="{system.ip_address}" and r["CityName"]=="{city_name}")
            |> sort(columns: ["_time"], desc: false)
            |> last()
            """  # noqa
        tables = client.query_api().query(query, org=settings.INFLUX_ORG)

        try:
            system.mri_embedded_parameters["helium"] = tables[0].records[0]["_value"]
            system.save()
        except IndexError:
            pass
        finally:
            client.close()

        return system
