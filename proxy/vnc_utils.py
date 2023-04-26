import asyncio
import logging
from collections import defaultdict

from asgiref.sync import sync_to_async
from django.conf import settings
from fastapi import HTTPException, WebSocket, WebSocketDisconnect

from core.models import System
from proxy.telnetlib import Telnet


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


@sync_to_async
def start_vnc_server_using_telnet(telnet: Telnet, system: System):
    telnet.open(system.ip_address)
    telnet.read_until(b"login: ", timeout=5)

    assert system.telnet_username
    telnet.write(system.telnet_username.encode("ascii") + b"\n")
    telnet.msg("Username written")

    telnet.read_until(b"Password: ", timeout=5)

    assert system.telnet_password
    telnet.write(system.telnet_password.encode("ascii") + b"\n")
    telnet.msg("Password written")

    telnet.read_until(b"Terminal type?", timeout=5)
    telnet.read_until(b" ", timeout=5)
    telnet.write(b"xterm-256color\n")
    telnet.msg("Terminal type set")

    telnet.expect([system.telnet_username.encode("ascii") + b"@"], timeout=5)
    telnet.msg("Login success")

    assert system.vnc_server_path
    telnet.write(b"cd " + system.vnc_server_path.encode("ascii") + b"\n")
    telnet.write(b"./gemsvnc -shared\n")
    index, _, text = telnet.expect(
        [
            b"GEMS VNC Server ready",
            b"Address already in use",
        ],
        timeout=5,
    )
    if index == -1:
        telnet.msg(text)
        raise HTTPException(status_code=500, detail="Could not start server")
    else:
        telnet.msg("GEMS VNC started")


class TelnetContextManager:
    system_connections = defaultdict(int)
    telnet_connections = {}

    def __init__(self, system: System):
        self.system = system

    async def __aenter__(self):
        if self.system_connections[self.system.id] == 0:
            telnet = Telnet()
            telnet.set_debuglevel(settings.TELNET_LOG_LEVEL)

            await start_vnc_server_using_telnet(telnet, self.system)

            self.telnet_connections[self.system.id] = telnet

        self.system_connections[self.system.id] += 1
        if settings.TELNET_LOG_LEVEL:
            print(
                f"Connections to {self.system.ip_address} = "
                f"{self.system_connections[self.system.id]}"
            )

    async def __aexit__(self, exc_type, exc, tb):
        @sync_to_async
        def close():
            self.telnet_connections[self.system.id].close()
            if settings.TELNET_LOG_LEVEL:
                print(f"Closing telnet connection to {self.system.ip_address}")

        self.system_connections[self.system.id] -= 1
        if self.system_connections[self.system.id] <= 0:
            await close()
            self.system_connections[self.system.id] = 0
