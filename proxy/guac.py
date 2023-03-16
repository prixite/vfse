import asyncio
import logging

from django.contrib.sessions.models import Session
from django.db.models import Q
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect

from core.models import OrganizationHealthNetwork, System, User
from core.views.mixins import UserOganizationMixin
from guacamole.client import GuacamoleClient
from guacamole.instruction import Instruction

app = FastAPI()


async def guacd_to_client(websocket: WebSocket, client: GuacamoleClient):
    while True:
        instruction = await client.read()
        if instruction.error:
            logging.error(f"{instruction.short_description}-{instruction.description}")
        await websocket.send_text(str(instruction))


async def get_user_from_session(sessionid: str):
    # Can be used to authenticate Django user
    session = await Session.objects.aget(pk=sessionid)
    if session is None:
        raise HTTPException(status_code=401, detail="session record not found.")
    user_id = session.get_decoded().get("_auth_user_id")
    user = User.objects.get(pk=user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="user record not found")
    return user


def check_user_has_system_access(system_id: int, organization_id: int, user):
    customer_admin = UserOganizationMixin()
    if not user.get_organization_role(organization_id):
        raise HTTPException(
            status_code=404, detail="user doesn't have access to origanization"
        )
    system = System.objects.filter(
        id__in=user.get_organization_systems(organization_id)
    ).filter(id=system_id)
    if (
        user.is_superuser
        or user.is_supermanager
        or customer_admin.is_customer_admin(organization_id)
    ):
        system = System.objects.filter(
            Q(site__organization_id=organization_id)
            | Q(
                site__organization_id__in=OrganizationHealthNetwork.objects.filter(  # noqa
                    organization_id=organization_id
                ).values_list(
                    "health_network"
                )
            )
        ).filter(id=system_id)

    if user.get_organization_role(organization_id) and not system.exists():
        raise HTTPException(
            status_code=403,
            detail="user has access to organization but doesn't have access to the system.",  # noqa
        )
    return system


def get_session_id_from_headers(headers):
    session_id = None
    for i in headers:
        if i[0] == b"cookie":
            cookie_dict = dict(x.split("=") for x in i[1].decode("utf-8").split("; "))
            session_id = cookie_dict.get("sessionid")
    if session_id is None:
        raise HTTPException(status_code=404, detail="session id not found")
    return session_id


@app.get("/")
def index():
    return {"Hello": "World"}


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
async def raw_websocket(
    websocket: WebSocket, host: str, port: str, system_id: int, organization_id: int
):
    await websocket.accept()
    header = websocket.scope.get("headers")
    session_id = get_session_id_from_headers(header)
    user = await get_user_from_session(session_id)
    check_user_has_system_access(system_id, organization_id, user)
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
