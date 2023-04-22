import asyncio
import logging

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect

from core.models import System
from proxy.service_utils import (
    get_system,
    get_user_from_request,
    is_authenticated,
)

app = FastAPI()


async def vnc_to_ws(websocket: WebSocket, reader):
    while True:
        data = await reader.read(2**16)
        await websocket.send_bytes(data)


async def connect_to_server(websocket: WebSocket, system: System):
    reader, writer = await asyncio.open_connection(system.ip_address, system.vnc_port)
    logging.info(f"Connection with {system.ip_address}:{system.vnc_port} established")
    task = asyncio.get_event_loop().create_task(vnc_to_ws(websocket, reader))

    try:
        while True:
            data = await websocket.receive_bytes()
            writer.write(data)
            await writer.drain()
    except WebSocketDisconnect:
        task.cancel()

    await asyncio.wait([task])


@app.websocket("/sockify/{organization_id:int}/{system_id:int}")
async def raw_websocket(organization_id: int, system_id: int, websocket: WebSocket):
    if not is_authenticated(websocket):
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = await get_user_from_request(websocket)
    system = await get_system(user, organization_id, system_id)

    if not system.connection_options.get("vfse"):
        raise HTTPException(status_code=400, detail="No vnc access for system")

    await websocket.accept()
    await connect_to_server(websocket, system)
