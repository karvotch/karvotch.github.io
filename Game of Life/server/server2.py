#!/usr/bin/env python

# WS server example

import asyncio
import websockets

async def hello(websocket, path):
    name = await websocket.recv()
    print(f"< {name}")
    name = int(name)
    name += 2
    name = f"{name}"

    greeting = f"Hello {name}!"

    await websocket.send(name)
    print(f"> {greeting}")

start_server = websockets.serve(hello, "localhost", 9999)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
