import asyncio
import logging

from asgiref.sync import sync_to_async
from django.conf import settings
from fastapi import WebSocket, WebSocketDisconnect

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
    telnet.write(b"./gemsvnc\n")
    telnet.read_until(b"GEMS VNC Server ready")
    telnet.msg("GEMS VNC started")


class TelnetContextManager:
    def __init__(self, system: System):
        self.system = system
        self.telnet = Telnet()
        self.telnet.set_debuglevel(settings.TELNET_LOG_LEVEL)

    async def __aenter__(self):
        await start_vnc_server_using_telnet(self.telnet, self.system)

    async def __aexit__(self, exc_type, exc, tb):
        @sync_to_async
        def close():
            self.telnet.close()

        await close()
