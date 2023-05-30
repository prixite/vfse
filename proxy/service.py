import httpx
from django.conf import settings
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
    pass


@app.get("/{path:path}")
async def index_proxy(path: str, request: Request):
    if not is_authenticated(request):
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = await get_user_from_request(request)
    organization_id, system_id = get_system_info_from_hostname(request)
    system = await get_system(user, organization_id, system_id)

    if not system.connection_options.get("service_web_browser"):
        raise HTTPException(
            status_code=400, detail="No service browser access for system"
        )

    url = f"http://{system.ip_address}/{path}"
    async with httpx.AsyncClient() as client:
        proxy = await client.get(url)

    response = Response(content=proxy.content)
    response.headers.update(proxy.headers)
    response.status_code = proxy.status_code
    return response
