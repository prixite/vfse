import asyncio
import logging
import re

import httpx
from bs4 import BeautifulSoup
from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect

app = FastAPI()


@app.get("/")
def index():
    return {"Hello": "World"}


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
    def add_prefix(path):
        return f"/systems/{system_id}{path}"

    if not path.startswith("service"):
        path = f"service/{path}"

    async with httpx.AsyncClient() as client:
        url = f"http://10.47.31.241/{path}"
        proxy = await client.get(url)

    content = proxy.content
    headers = proxy.headers

    if b"tracing" in content:
        soup = BeautifulSoup(proxy.content, features="html.parser")

        for tag in soup.find_all(src=re.compile("^/")):
            tag.attrs["src"] = add_prefix(tag.attrs["src"])

        content = soup.encode()
        headers.update({"content-length": str(len(content))})

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


@app.post("/systems/{path:path}")
async def inner_post_proxy(path: str, request: Request):
    if not path.startswith("service"):
        path = f"service/{path}"

    async with httpx.AsyncClient() as client:
        url = f"http://10.47.31.241/{path}"
        proxy = await client.post(url)

    content = proxy.content
    headers = proxy.headers

    response = Response(content=content)
    response.headers.update(headers)
    response.status_code = proxy.status_code
    return response
