import re
import httpx
import asyncio
import logging
from bs4 import BeautifulSoup

from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect

from guacamole.client import GuacamoleClient
from guacamole.instruction import Instruction

app = FastAPI()


async def guacd_to_client(websocket: WebSocket, client: GuacamoleClient):
    while True:
        instruction = await client.read()
        if instruction.error:
            logging.error(f"{instruction.short_description}-{instruction.description}")
        await websocket.send_text(str(instruction))


"""
@app.get("/")
def index():
    return {"Hello": "World"}
    """


@app.websocket("/websocket/")
async def websocket_endpoint(
    websocket: WebSocket,
    guacd_host: str,
    guacd_port: str,
    protocol: str,
    remote_host: str,
    remote_port: str,
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


async def vnc_to_ws(websocket: WebSocket, reader):
    while True:
        data = await reader.read(2**16)
        await websocket.send_bytes(data)


@app.websocket("/sockify/")
async def raw_websocket(websocket: WebSocket, host: str, port: str):
    await websocket.accept()
    reader, writer = await asyncio.open_connection(host, port)
    logging.info(f"Connection with {host}:{port} established")
    task = asyncio.get_event_loop().create_task(vnc_to_ws(websocket, reader))

    try:
        while True:
            data = await websocket.receive_bytes()
            writer.write(data)
            await writer.drain()
    except WebSocketDisconnect:
        task.cancel()

    await asyncio.wait([task])


@app.get("/systems/{system_id:int}/{path:path}")
async def index_proxy(system_id: int, path: str, request: Request):
    add_prefix = lambda x: f"/systems/{system_id}" + x

    if not path.startswith("service"):
        path = f"service/{path}"

    async with httpx.AsyncClient() as client:
        url = f"http://10.47.31.241/{path}"
        proxy = await client.get(url)

    content = proxy.content
    headers = proxy.headers

    if b'tracing' in content:
        soup = BeautifulSoup(proxy.content, features="html.parser")

        for tag in soup.find_all(src=re.compile("^/")):
            tag.attrs['src'] = add_prefix(tag.attrs['src'])

        content = soup.encode()
        headers.update({'content-length': str(len(content))})

    response = Response(content=content)
    response.headers.update(headers)
    response.status_code = proxy.status_code
    return response


@app.get("/systems/{path:path}")
async def inner_proxy(path: str, request: Request):
    if not path.startswith("service"):
        path = f"service/{path}"

    async with httpx.AsyncClient() as client:
        url = f"http://10.47.31.241/{path}"
        proxy = await client.get(url)

    content = proxy.content
    headers = proxy.headers

    response = Response(content=content)
    response.headers.update(headers)
    response.status_code = proxy.status_code
    return response
