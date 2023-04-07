import httpx
from django.conf import settings
from fastapi import FastAPI, HTTPException, Request, Response

from proxy.service_utils import (
    get_system,
    get_user_from_request,
    is_authenticated,
)

app = FastAPI()


@app.get("/{organization_id:int}/{system_id:int}/{path:path}")
async def index_proxy(
    organization_id: int, system_id: int, path: str, request: Request
):
    if not is_authenticated(request):
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = await get_user_from_request(request)
    system = await get_system(user, organization_id, system_id)

    if not system.connection_options.get("service_web_browser"):
        raise HTTPException(status_code=400, detail="No service browser access for system")

    if not path.startswith("service"):
        path = f"service/{path}"

    url = f"http://{system.ip_address}/{path}"
    async with httpx.AsyncClient() as client:
        proxy = await client.get(url)

    content = proxy.content.replace(
        b"/service/",
        settings.HTML_PROXY_PATH.encode()
        + str(organization_id).encode()
        + b"/"
        + str(system_id).encode()
        + b"/service/",
    )

    keys = [
        b"dd/site.htm",
        b"dd/lastkey.htm",
        b"global/execform.htm",
        b"global/stopform.htm",
        b"global/terminateform.htm",
        b"global/debugform.htm",
        b"ggjscript/ggjscript.htm",
        b"access/access.htm",
        b"homemenu/homemenu.stm",
    ]

    if settings.HTML_PROXY_PATH == "/":
        for key in keys:
            content = content.replace(key, str(system_id).encode() + b"/" + key)
    else:
        for key in keys:
            content = content.replace(
                key,
                str(organization_id).encode()
                + b"/"
                + str(system_id).encode()
                + b"/"
                + key,
            )

    proxy.headers.update({"content-length": str(len(content))})
    response = Response(content=content)
    response.headers.update(proxy.headers)
    response.status_code = proxy.status_code
    return response


@app.post("/{organization_id:int}/{system_id:int}/{path:path}")
async def post_proxy(organization_id: int, system_id: int, path: str, request: Request):
    if not is_authenticated(request):
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = await get_user_from_request(request)
    system = await get_system(user, organization_id, system_id)

    if not path.startswith("service"):
        path = f"service/{path}"

    url = f"http://{system.ip_address}/{path}"

    data = await request.form()
    async with httpx.AsyncClient() as client:
        proxy = await client.post(url, data=dict(data))

    response = Response(content=proxy.content)
    response.headers.update(proxy.headers)
    response.status_code = proxy.status_code
    return response
