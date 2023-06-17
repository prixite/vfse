import gzip
import time
from urllib import parse

import httpx
from fastapi import FastAPI, HTTPException, Request, Response

from proxy.service_utils import (
    get_system,
    get_user_from_request,
    is_authenticated,
)

PROTOCOL_CACHE = {}
MAX_CACHE_SIZE = 500


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
        set_protocol(base_url, result.scheme)
        host = request.headers["host"]
        protocol = request.headers.get("x-forwarded-proto", "http")
        result = parse.urlparse(location)
        return f"{protocol}://{host}{result.path}"

    return location


def set_protocol(base_url, value):
    if len(PROTOCOL_CACHE) >= MAX_CACHE_SIZE:
        data = [(k, v["time"]) for k, v in PROTOCOL_CACHE.items()]
        data.sort()
        for k, _ in data[:50]:
            PROTOCOL_CACHE.pop(k)

    PROTOCOL_CACHE[base_url] = {"time": time.time(), "value": value}


def get_protocol(base_url):
    try:
        value = PROTOCOL_CACHE[base_url]["value"]
        set_protocol(base_url, value)
    except KeyError:
        value = "http"

    return value


async def proxy(method_name: str, path: str, request: Request):
    if not is_authenticated(request):
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = await get_user_from_request(request)
    organization_id, system_id = get_system_info_from_hostname(request)
    system = await get_system(user, organization_id, system_id)

    if not system.connection_options.get("service_web_browser"):
        raise HTTPException(
            status_code=400, detail="No service browser access for system"
        )

    base_url = to_netloc(system.safe_service_page_url)
    headers = {k: v for k, v in request.headers.items() if k not in ["cookie", "host"]}
    async with httpx.AsyncClient(verify=False) as client:
        method = getattr(client, method_name)
        url = f"{get_protocol(base_url)}://{base_url}/{path}"
        if method_name in ["post"]:
            data = await request.form()
            proxy_result = await method(url, data=data, headers=headers)
        else:
            proxy_result = await method(
                url, params=request.query_params, headers=headers
            )

    content = proxy_result.content
    if proxy_result.headers.get("content-encoding") == "gzip":
        content = gzip.compress(content)

    response = Response(content=content)
    response.headers.update(proxy_result.headers)
    response.headers.update({"content-length": str(len(content))})

    if "location" in response.headers:
        location = response.headers["location"]
        new_location = replace_host_in_location(base_url, location, request)
        response.headers["location"] = new_location

    response.status_code = proxy_result.status_code
    return response


@app.get("/{path:path}")
async def get_proxy(path: str, request: Request):
    return await proxy("get", path, request)


@app.post("/{path:path}")
async def post_proxy(path: str, request: Request):
    return await proxy("post", path, request)
