import openai
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from influxdb_client import InfluxDBClient

from core import models


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
    system = models.System.objects.get(id=system_id)
    data = get_data_from_influxdb(system.ip_address)
    if data:
        system.mri_embedded_parameters["helium"] = data
        system.save()
    return system


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


url_regex = r"((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z]){2,6}([a-zA-Z0-9\.\&\/\?\:@\-_=#])*"  # noqa
