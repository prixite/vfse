from fastapi import FastAPI, HTTPException, WebSocket

from proxy.service_utils import (
    get_system,
    get_user_from_request,
    is_authenticated,
)
from proxy.vnc_utils import TelnetContextManager, connect_to_server

app = FastAPI()


@app.websocket("/sockify/{organization_id:int}/{system_id:int}")
async def raw_websocket(organization_id: int, system_id: int, websocket: WebSocket):
    if not is_authenticated(websocket):
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = await get_user_from_request(websocket)
    system = await get_system(user, organization_id, system_id)

    if not system.connection_options.get("vfse"):
        raise HTTPException(status_code=400, detail="No vnc access for system")

    await websocket.accept()
    if system.telnet_username:
        async with TelnetContextManager(system):
            await connect_to_server(websocket, system)
    else:
        await connect_to_server(websocket, system)
