import os

import openai
from django.conf import settings
from influxdb_client import InfluxDBClient

from core import models


def get_chat_bot_response(question, system_id):
    openai.api_key = settings.OPENAI_API_KEY
    with open(os.getcwd() + "/core/openapi/data/content.txt") as f:
        prompt = f.readlines()[0]
    if not question:
        return "please enter some text to get response"
    query = prompt + question
    response = openai.Completion.create(
        engine="text-davinci-002",
        prompt=query,
        temperature=0.6,
        max_tokens=1445,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    answer = (response.choices[0].text).replace("A:", "")
    return answer


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
