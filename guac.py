import asyncio
import logging

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from guacamole.client import GuacamoleClient
from guacamole.instruction import Instruction

app = FastAPI()


async def guacd_to_client(websocket: WebSocket, client: GuacamoleClient):
    while True:
        instruction = await client.read()
        if instruction.error:
            logging.error(f"{instruction.short_description}-{instruction.description}")
        await websocket.send_text(str(instruction))


@app.websocket("/websocket/")
async def websocket_endpoint(
    websocket: WebSocket,
    guacd_host: str,
    guacd_port: str,
    protocol: str,
    remote_host: str,
    remote_port: str,
    username: str,
    password: str,
    width: str,
    height: str,
    dpi: str,
):
    await websocket.accept(subprotocol="guacamole")
    client = GuacamoleClient(
        guacd_host,
        guacd_port,
        {
            "protocol": protocol,
            "size": [width, height, dpi],
            "audio": [],
            "video": [],
            "image": [],
            "args": {
                "hostname": remote_host,
                "port": remote_port,
                "username": username,
                "password": password,
            },
        },
        debug=True,
    )
    await client.connect()
    await client.handshake()

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
