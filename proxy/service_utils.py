import re
from importlib import import_module

from asgiref.sync import sync_to_async
from django.conf import settings
from django.contrib.auth import SESSION_KEY
from fastapi import HTTPException, Request

from core.models import System, User


def is_authenticated(request: Request) -> bool:
    return "sessionid" in request.cookies


@sync_to_async
def get_user_id_from_request(request: Request):
    engine = import_module(settings.SESSION_ENGINE)
    session_key = request.cookies.get(settings.SESSION_COOKIE_NAME)
    session = engine.SessionStore(session_key)
    return User._meta.pk.to_python(session[SESSION_KEY])


async def get_user_from_request(request: Request):
    return await User.objects.aget(id=await get_user_id_from_request(request))


@sync_to_async
def get_organization_systems(user, organization_id):
    return user.get_organization_systems(organization_id)


async def get_system(user, organization_id, system_id):
    queryset = await get_organization_systems(user, organization_id)
    try:
        system = await queryset.filter(id=system_id).aget()
    except System.DoesNotExist:
        raise HTTPException(status_code=404, detail="Not found")

    return system


def get_system_id_from_referrer(referrer):
    result = re.search(r"/htmlproxy/(\d+)/service/", referrer)
    if not result:
        return

    return int(result.group(1))
