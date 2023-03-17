import httpx
from fastapi import FastAPI, Request, Response

from core import models
from proxy.service_utils import get_system_id_from_referrer

app = FastAPI()


async def get_request(system_id, path):
    system = await models.System.objects.aget(id=system_id)
    if not path.startswith("service"):
        path = f"service/{path}"

    url = f"http://{system.ip_address}/{path}"
    async with httpx.AsyncClient() as client:
        proxy = await client.get(url)

    content = proxy.content.replace(
        b"/service/", b"/htmlproxy/" + str(system_id).encode() + b"/service/"
    )

    for key in [
        b"dd/site.htm",
        b"dd/lastkey.htm",
        b"global/execform.htm",
        b"global/stopform.htm",
        b"global/terminateform.htm",
        b"global/debugform.htm",
        b"ggjscript/ggjscript.htm",
        b"access/access.htm",
    ]:
        content = content.replace(key, str(system_id).encode() + b"/" + key)

    proxy.headers.update({"content-length": str(len(content))})
    response = Response(content=content)
    response.headers.update(proxy.headers)
    response.status_code = proxy.status_code
    return response


@app.get("/{system_id:int}/{path:path}")
async def index_proxy(system_id: int, path: str):
    return await get_request(system_id, path)


@app.post("/{system_id:int}/{path:path}")
async def login(system_id: int, path: str, request: Request):
    return await post_request(system_id, path, request)


@app.post("/{path:path}")
async def post_inner(path: str, request: Request):
    return await post_request(
        get_system_id_from_referrer(request.headers["referrer"]),
        path,
        request,
    )


async def post_request(system_id, path, request):
    system = await models.System.objects.aget(id=system_id)
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
