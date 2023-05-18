import { useRef, useEffect } from "react";

import Guacamole from "guacamole-common-js";

import { useSelectedOrganization } from "@src/store/hooks";
import { System } from "@src/store/reducers/generated";

interface TerminalScreenProp {
  system: System;
  protocol: "ssh" | "telnet";
}

export function TerminalScreen({ system, protocol }: TerminalScreenProp) {
  const selectedOrganization = useSelectedOrganization();
  const tunnelURL = process.env.GUACD_PROXY_WS;
  const width = 1024;
  const height = 768;

  const guac = useRef(null);
  const keyboard = useRef(null);
  const displayRef = useRef(null);

  useEffect(() => {
    const tunnel = new Guacamole.WebSocketTunnel(tunnelURL);
    guac.current = new Guacamole.Client(tunnel);
    displayRef.current.appendChild(guac.current.getDisplay().getElement());
    guac.current.connect(
      [
        `protocol=${protocol}`,
        `organization_id=${selectedOrganization?.id}`,
        `system_id=${system.id}`,
        `width=${width}`,
        `height=${height}`,
        `dpi=96`,
      ].join("&")
    );

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
