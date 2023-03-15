import asyncio
import logging
import re

import httpx
from bs4 import BeautifulSoup
from fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect

from guacamole.client import GuacamoleClient

app = FastAPI()


async def get_request(path):
    if not path.startswith("service"):
        path = f"service/{path}"

    url = f"http://10.47.31.241/{path}"
    async with httpx.AsyncClient() as client:
        proxy = await client.get(url)

    response = Response(content=proxy.content)
    response.headers.update(proxy.headers)
    response.status_code = proxy.status_code
    return response


@app.get("/{system_id:int}/{path:path}")
async def index_proxy(system_id: int, path: str, request: Request):
    print(request.cookies)
    return await get_request(path)


@app.get("/{path:path}")
async def index_inner_proxy(path: str):
    return await get_request(path)


# A34B28
@app.post("/{system_id:int}/{path:path}")
async def login(path: str, request: Request):
    return await post_request(path, request)


@app.post("/{path:path}")
async def post_inner(path: str, request: Request):
    return await post_request(path, request)


async def post_request(path, request):
    data = await request.form()
    url = f"http://10.47.31.241/service/{path}"

    async with httpx.AsyncClient() as client:
        proxy = await client.post(url, data=dict(data))

    response = Response(content=proxy.content)
    response.headers.update(proxy.headers)
    response.status_code = proxy.status_code
    return response
