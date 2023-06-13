from urllib import parse

import httpx
from fastapi import FastAPI, HTTPException, Request, Response
from core import models

from proxy.service_utils import (
    get_system,
    get_user_from_request,
    is_authenticated,
)

app = FastAPI()


@app.get("/health")
def health(request: Request):
    return "OK"


def get_system_info_from_hostname(request: Request):
    result = parse.urlparse(str(request.base_url))
    system_info, *_ = result.netloc.split(".")
    _, organization_id, system_id = system_info.split("-")
    return int(organization_id), int(system_id)


def to_netloc(url: str):
    result = parse.urlparse(url)
    return result.netloc


def replace_host_in_location(base_url: str, location: str, request: Request):
    result = parse.urlparse(location)
    if base_url == result.netloc:
        PROTOCOL_CACHE[base_url] = result.scheme
        host = request.headers["host"]
        protocol = request.headers.get("x-forwarded-proto", "http")
        result = parse.urlparse(location)
        return f"{protocol}://{host}{result.path}"

    return location


PROTOCOL_CACHE = {}


async def proxy(method_name: str, path: str, request: Request, data=None):
    if not is_authenticated(request):
        raise HTTPException(status_code=403, detail="Not authenticated")

    """
    user = await get_user_from_request(request)
    organization_id, system_id = get_system_info_from_hostname(request)
    system = await get_system(user, organization_id, system_id)
    """
    system = await models.System.objects.aget(id=61)

    if not system.connection_options.get("service_web_browser"):
        raise HTTPException(
            status_code=400, detail="No service browser access for system"
        )

    base_url = to_netloc(system.safe_service_page_url)
    headers = {k: v for k, v in request.headers.items() if k not in ['cookie', 'host']}
    async with httpx.AsyncClient() as client:
        method = getattr(client, method_name)
        protocol = PROTOCOL_CACHE.get(base_url, "http")
        url = f"{protocol}://{base_url}/{path}"
        print("*" * 100, url)
        if data is None:
            proxy = await method(url, headers=headers)
        else:
            proxy = await method(url, data=dict(data), headers=headers)

    import pprint
    pprint.pprint(dict(headers))
    pprint.pprint(dict(proxy.headers))
    #return Response(content="Hello")
    response = Response(content=proxy.content)
    response.headers.update(proxy.headers)
    if "location" in response.headers:
        location = response.headers["location"]
        new_location = replace_host_in_location(base_url, location, request)
        response.headers["location"] = new_location

    response.status_code = proxy.status_code
    return response


@app.get("/{path:path}")
async def get_proxy(path: str, request: Request):
    return await proxy("get", path, request)


@app.post("/{path:path}")
async def post_proxy(path: str, request: Request):
    return await proxy("post", path, request, request.form())
