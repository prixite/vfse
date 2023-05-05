import openai
import openai.error
from django.conf import settings
from django.core.mail import send_mail
from django.http import HttpResponse
from django.template.loader import render_to_string
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS

from core import models

url_regex = r"((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z]){2,6}([a-zA-Z0-9\.\&\/\?\:@\-_=#])*"  # noqa

CRADLEPOINT_REQUEST_HEADERS = {
    "X-CP-API-ID": settings.X_CP_API_ID,
    "X-CP-API-KEY": settings.X_CP_API_KEY,
    "X-ECM-API-ID": settings.X_ECM_API_ID,
    "X-ECM-API-KEY": settings.X_ECM_API_KEY,
    "Content-Type": "application/json",
}
CRADLEPOINT_API_URL = "https://www.cradlepointecm.com/api/v2/"


def send_topic_email(topic, user, comment):
    if topic.reply_email_notification and topic.user.id != user.id:
        organization = topic.user.get_default_organization()
        message = f"{user.get_full_name()} just commented on your post '{topic.title}'."
        msg_html = render_to_string(
            "core/emails/topic_notification.html",
            {
                "topic_link": f"{settings.DOMAIN_NAME}/clients/{organization.id}/forum/topic/{topic.id}/",  # noqa
                "content": comment,
                "message": message,
                "user": topic.user,
            },
        )
        send_mail(
            message,
            f"{comment} \nclick on the link below. \n{settings.DOMAIN_NAME}/clients/{organization.id}/forum/topic/{topic.id}/",  # noqa
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[topic.user.username],
            fail_silently=True,
            html_message=msg_html,
        )


def get_chat_bot_response(question, prompt):
    openai.api_key = settings.OPENAI_API_KEY
    if not question:
        return "Please enter some text to get response."

    query = f"{prompt}\n{question}"

    if query[-1] not in "?.!":
        query = query + "."

    max_tokens = int(len(query.split()) * 4 / 3)
    max_tokens = min(max_tokens, 4000)
    max_tokens = max(max_tokens, 256)

    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            max_tokens=max_tokens,
            prompt=query,
            temperature=0.6,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0,
            timeout=15,
            request_timeout=15,
        )
    except openai.error.RateLimitError:
        return (
            "Temporary network failure occurred. "
            "Please try again in a couple of minutes."
        )
    except openai.error.Timeout:
        return "Request timed out. Can you try to rephrase your question?"

    if not response.choices[0].text:
        return "Please elaborate your question."

    return response.choices[0].text


def fetch_from_influxdb(system_id):
    system = models.System.objects.get(id=system_id)
    data = get_data_from_influxdb(system.ip_address)
    if data:
        system.mri_embedded_parameters["helium"] = data
        system.save()
    return system


def post_gps_data_to_influxdb(long, lat, name, state):
    with InfluxDBClient(
        url=settings.INFLUX_DB_URL,
        token=settings.INFLUX_GPS_TOKEN,
        org=settings.INFLUX_ORG,
    ) as client:
        write_api = client.write_api(write_options=SYNCHRONOUS)
        record = (
            Point("routerLocations")
            .tag("state", state)
            .tag("name", name)
            .tag("label", "GPS-DATA")
            .field("longitude", long)
            .field("latitude", lat)
        )
        write_api.write(
            bucket=settings.INFLUX_GPS_BUCKET, org=settings.INFLUX_ORG, record=record
        )


def get_data_from_influxdb(system_ip_address):
    city_name = "Plantation"
    with InfluxDBClient(
        url=settings.INFLUX_DB_URL,
        token=settings.INFLUX_TOKEN,
        org=settings.INFLUX_ORG,
    ) as client:

        query = f"""
            from(bucket: "{settings.INFLUX_BUCKET}")
            |> range(start: -7d)
            |> filter(fn:(r) => r._measurement=="HeLevel" and r._field=="value")
            |> filter(fn:(r) => r["IPAddress"]=="{system_ip_address}" and r["CityName"]=="{city_name}")
            |> sort(columns: ["_time"], desc: false)
            |> last()
            """  # noqa
        tables = client.query_api().query(query, org=settings.INFLUX_ORG)
        data = None
        try:
            data = tables[0].records[0]["_value"]
        except IndexError:
            pass
        finally:
            client.close()

        return data


def get_system(user, organization_id, system_id):
    queryset = user.get_organization_systems(organization_id)
    try:
        system = queryset.filter(id=system_id).get()
    except models.System.DoesNotExist:
        raise HttpResponse("Not found")

    return system
