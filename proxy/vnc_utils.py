import asyncio
import logging
import telnetlib

from fastapi import WebSocket, WebSocketDisconnect

from core.models import System


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


def try_vnc_server_through_telnet(system):
    if not (
        system.telnet_username and system.telnet_password and system.vnc_server_path
    ):
        return

    telnet = telnetlib.Telnet(system.ip_address)
    telnet.read_until(b"login: ")
    telnet.write(system.telnet_username.encode("ascii") + b"\n")
    telnet.read_until(b"Password: ")
    telnet.write(system.telnet_password.encode("ascii") + b"\n")

    telnet.write(b"cd " + system.vnc_server_path.encode("ascii"))
    telnet.write(b"./gemsvnc")


async def run_cmd(cmd):
    return await asyncio.create_subprocess_shell(
        cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )


async def main():
    pass


if __name__ == "__main__":
    asyncio.run(main())
