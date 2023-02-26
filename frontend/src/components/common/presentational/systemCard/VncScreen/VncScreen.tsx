import { useRef, useEffect } from "react";

import Guacamole, { WebSocketTunnel } from "guacamole-common-js";

import { System } from "@src/store/reducers/generated";

interface VncScreenProp {
  system: System;
  username: string;
  password: string;
}

export function VncScreen({ system, username, password }: VncScreenProp) {
  const GUACD_IP = "74.207.234.105";
  const GUACD_PORT = "4822";
  const tunnelURL = "ws://localhost:8001/websocket/";
  const width = 1024;
  const height = 768;

  const guac = useRef(null);
  const keyboard = useRef(null);
  const mouse = useRef(null);
  const displayRef = useRef(null);

  useEffect(() => {
    guac.current = new Guacamole.Client(new WebSocketTunnel(tunnelURL));
    displayRef.current.appendChild(guac.current.getDisplay().getElement());
    guac.current.connect(
      [
        `guacd_host=${GUACD_IP}`,
        `guacd_port=${GUACD_PORT}`,
        `protocol=vnc`,
        `remote_host=${system.access_url}`,
        `remote_port=${system.vnc_port}`,
        `username=${username}`,
        `password=${password}`,
        `width=${width}`,
        `height=${height}`,
        `dpi=96`,
      ].join("&")
    );

    // Mouse
    mouse.current = new Guacamole.Mouse(guac.current.getDisplay().getElement());

    mouse.current.onmousedown =
      mouse.current.onmouseup =
      mouse.current.onmousemove =
        function (mouseState) {
          guac.current.sendMouseState(mouseState);
        };

    // Keyboard
    keyboard.current = new Guacamole.Keyboard(document);

    keyboard.current.onkeydown = function (keysym) {
      guac.current.sendKeyEvent(1, keysym);
    };

    keyboard.current.onkeyup = function (keysym) {
      guac.current.sendKeyEvent(0, keysym);
    };

    return function cleanup() {
      guac.current.disconnect();
    };
  }, []);

  return (
    <div
      ref={displayRef}
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        cursor: "none",
        zIndex: "800",
      }}
    />
  );
}
