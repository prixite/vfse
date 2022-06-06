//SSHClient
import { useEffect, useState, FunctionComponent } from "react";

import { Terminal } from "xterm";
import "xterm/css/xterm.css";

type Props = {
  //Pass the four parameters, which are the information of the server you need to connect to.
  host?: string;
  port?: number;
  username?: string;
  password?: string;
};

const WebTerminal: FunctionComponent<Props> = (props) => {
  const { host, port, username, password } = props;
  const [webTerminal, setWebTerminal] = useState<Terminal | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Add listening event
    if (webTerminal && ws) {
      // monitor
      webTerminal.onKey((e) => {
        const { key } = e;
        ws.send(key);
      });
      // ws listening
      ws.onmessage = (e) => {
        if (webTerminal) {
          if (typeof e.data === "string") {
            webTerminal.write(e.data);
          }
        }
      };
    }
  }, [webTerminal, ws]);

  useEffect(() => {
    // Initialize terminal
    const ele = document.getElementById("terminal");
    while (ele && ele.hasChildNodes()) {
      //When there are still child nodes under the table, the loop continues
      //This is to correct the parameter in case of wrong parameter input. Click Connect to create a new window
      ele && ele.firstChild && ele.removeChild(ele.firstChild);
    }
    if (ele) {
      // initialization
      const terminal = new Terminal({
        cursorBlink: true,
        cols: 175,
        rows: 40,
      });
      terminal.focus();
      terminal.onKey((e) => {
        // terminal.write(e.key);
        if (e.key == "\r") {
          //   terminal.write('\nroot\x1b[33m$\x1b[0m');
        } else if (e.key == "\x7F") {
          terminal.write("\b \b");
        }
      });

      terminal.open(ele);
      terminal.write("Connecting....");
      setWebTerminal(terminal);
    }
    // Initialize ws connection
    if (ws) ws.close();

    const socket = new WebSocket(
      "ws://localhost:8888/" + "ws?id=" + "140622818611648"
    );
    socket.onopen = () => {
      //Establish socket connection with the server
      const message = {
        host: host,
        port: port,
        username: username,
        password: password,
      };
      socket.send(JSON.stringify(message));
    };
    setWs(socket);
  }, [host, port, username, password]);

  return <div id="terminal" />;
};

export default WebTerminal;
//Just follow the project launch
