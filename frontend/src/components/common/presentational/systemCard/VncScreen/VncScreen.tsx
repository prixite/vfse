import { useRef } from "react";
import Guacamole from "guacamole-common-js";

export function VncScreen () {
  return <h1>VNC</h1>
}

/*
export function VncScreen() {
  const client = useRef();
  const keyboard = useRef();
  const mouse = useRef();

  const disconnect = () => {
    client.current.disconnect();
    document.getElementById("display").innerHTML = "";
    keyboard.current = null;
    mouse.current = null;
    client.current = null;
  };

  const connect = () => {
    const hostname = document.getElementById("guacd-host").value;
    const port = document.getElementById("guacd-port").value;
    const protocol = document.getElementById("protocol").value;
    const remoteHost = document.getElementById("remote-host").value;
    const remotePort = document.getElementById("remote-port").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const width = document.getElementById("width").value;
    const height = document.getElementById("height").value;
    const dpi = document.getElementById("dpi").value;
    const tunnel = new Guacamole.WebSocketTunnel(
      "ws://localhost:8000/websocket/"
    );
    const guac = (client.current = new Guacamole.Client(tunnel));
    document.getElementById("display").appendChild(guac.getDisplay().getElement());

    guac.onstatechange = (state) => {
      if (state === 5) {
        disconnect();
      }
    };

    guac.connect(
      [
        `guacd_host=${hostname}`,
        `guacd_port=${port}`,
        `protocol=${protocol}`,
        `remote_host=${remoteHost}`,
        `remote_port=${remotePort}`,
        `username=${username}`,
        `password=${password}`,
        `width=${width}`,
        `height=${height}`,
        `dpi=${dpi}`,
      ].join("&")
    );

    window.onunload = function () {
      disconnect();
    };

    // Mouse
    mouse.current = new Guacamole.Mouse(guac.getDisplay().getElement());

    mouse.current.onmousedown =
      mouse.current.onmouseup =
      mouse.current.onmousemove =
        function (mouseState) {
          guac.sendMouseState(mouseState);
        };

    // Keyboard
    keyboard.current = new Guacamole.Keyboard(document);

    keyboard.current.onkeydown = function (keysym) {
      guac.sendKeyEvent(1, keysym);
    };

    keyboard.current.onkeyup = function (keysym) {
      guac.sendKeyEvent(0, keysym);
    };
  };

  return <div id="display"></div>;
}

export default VncScreen;
*/
