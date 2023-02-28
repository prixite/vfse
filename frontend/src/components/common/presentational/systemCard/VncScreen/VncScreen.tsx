import { useRef, useEffect } from "react";

import Guacamole, { WebSocketTunnel } from "guacamole-common-js";

import { System } from "@src/store/reducers/generated";

interface VncScreenProp {
  system: System;
  username: string;
  password: string;
}

export function VncScreen({ system, username, password }: VncScreenProp) {
  const GUACD_HOST = process.env.GUACD_HOST;
  const GUACD_PORT = process.env.GUACD_PORT;
  const tunnelURL = process.env.GUACD_PROXY_WS;
  const width = 1024;
  const height = 768;

  const guac = useRef(null);
  const keyboard = useRef(null);
  const mouse = useRef(null);
  const displayRef = useRef(null);

  useEffect(() => {
    const tunnel = new WebSocketTunnel(tunnelURL);
    guac.current = new Guacamole.Client(tunnel);
    displayRef.current.appendChild(guac.current.getDisplay().getElement());
    guac.current.connect(
      [
        `guacd_host=${GUACD_HOST}`,
        `guacd_port=${GUACD_PORT}`,
        `protocol=vnc`,
        `remote_host=${system.access_url}`,
        `remote_port=${system.vnc_port}`,
        `width=${width}`,
        `height=${height}`,
        `dpi=96`,
      ].join("&")
    );

    const checkConnected = setInterval(() => {
      if (tunnel.isConnected()) {
        tunnel.sendMessage("creds", username, password);
        clearInterval(checkConnected);
      }
    }, 100);

    // Mouse
    mouse.current = new Guacamole.Mouse(guac.current.getDisplay().getElement());

    mouse.current.onmousedown =
      mouse.current.onmouseup =
      mouse.current.onmousemove =
        function (mouseState) {
          guac.current.sendMouseState(mouseState);
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
