import asyncio
import logging

from django.conf import settings
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect

from proxy.guacamole.client import GuacamoleClient
from proxy.guacamole.instruction import Instruction
from proxy.service_utils import (
    get_system,
    get_user_from_request,
    is_authenticated,
)

app = FastAPI()


async def guacd_to_client(websocket: WebSocket, client: GuacamoleClient):
    while True:
        instruction = await client.read()
        if instruction.error:
            logging.error(f"{instruction.short_description}-{instruction.description}")
        await websocket.send_text(str(instruction))


@app.get("/health")
def index():
    return "OK"


@app.websocket("/terminal/")
async def websocket_endpoint(
    websocket: WebSocket,
    protocol: str,
    system_id: int,
    organization_id: int,
    width: str,
    height: str,
    dpi: str,
):
    await websocket.accept(subprotocol="guacamole")

    if not is_authenticated(websocket):
        raise HTTPException(status_code=403, detail="Not authenticated")

    user = await get_user_from_request(websocket)
    system = await get_system(user, organization_id, system_id)

    client = GuacamoleClient(
        settings.GUACD_HOST,
        settings.GUACD_PORT,
        {
            "protocol": protocol,
            "size": [width, height, dpi],
            "audio": [],
            "video": [],
            "image": [],
            "args": {
                "hostname": system.ip_address,
                "port": 22 if protocol == "ssh" else 23,
            },
        },
        debug=False,
    )
    await client.connect()
    await client.handshake(websocket)
    logging.info("Handshake complete")

    task = asyncio.get_event_loop().create_task(guacd_to_client(websocket, client))

    try:
        while True:
            data = await websocket.receive_text()
            instruction = Instruction.from_string(data)
            await client.send(str(instruction))
    except WebSocketDisconnect:
        task.cancel()
        await client.close()

    await asyncio.wait([task])
