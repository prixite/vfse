from urllib import parse

import httpx
from fastapi import FastAPI, HTTPException, Request, Response

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


def to_base_url(url: str):
    result = parse.urlparse(url)
    return f"{result.scheme}://{result.netloc}"


@app.get("/{path:path}")
async def get_proxy(path: str, request: Request):
    if not is_authenticated(request):
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = await get_user_from_request(request)
    organization_id, system_id = get_system_info_from_hostname(request)
    system = await get_system(user, organization_id, system_id)

    if not system.connection_options.get("service_web_browser"):
        raise HTTPException(
            status_code=400, detail="No service browser access for system"
        )

    base_url = to_base_url(system.safe_service_page_url)
    async with httpx.AsyncClient() as client:
        proxy = await client.get(f"{base_url}/{path}")

    response = Response(content=proxy.content)
    response.headers.update(proxy.headers)
    response.status_code = proxy.status_code
    return response


@app.post("/{path:path}")
async def post_proxy(path: str, request: Request):
    if not is_authenticated(request):
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = await get_user_from_request(request)
    organization_id, system_id = get_system_info_from_hostname(request)
    system = await get_system(user, organization_id, system_id)

    if not system.connection_options.get("service_web_browser"):
        raise HTTPException(
            status_code=400, detail="No service browser access for system"
        )

    data = await request.form()
    base_url = to_base_url(system.safe_service_page_url)
    async with httpx.AsyncClient() as client:
        proxy = await client.post(f"{base_url}/{path}", data=dict(data))

    response = Response(content=proxy.content)
    response.headers.update(proxy.headers)
    response.status_code = proxy.status_code
    return response
