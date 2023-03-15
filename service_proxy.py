import asyncio
import logging
import re

import httpx
from bs4 import BeautifulSoup
from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect

from guacamole.client import GuacamoleClient

app = FastAPI()


@app.get("/{system_id:int}/{path:path}")
async def index_proxy(system_id: int, path: str):
    def add_prefix(src):
        return f"/{system_id}{src}"

    if not path.startswith("service"):
        path = f"service/{path}"

    url = f"http://10.47.31.241/{path}"
    async with httpx.AsyncClient() as client:
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


# A34B28
@app.post("/{system_id:int}/{path:path}")
async def login(path: str, request: Request):
    data = await request.form()
    url = f"http://10.47.31.241/service/{path}"

    async with httpx.AsyncClient() as client:
        proxy = await client.post(url, data=dict(data))

    content = proxy.content
    headers = proxy.headers

    response = Response(content=content)
    response.headers.update(headers)
    response.status_code = proxy.status_code
    return response
