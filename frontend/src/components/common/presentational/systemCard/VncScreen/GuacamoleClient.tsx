import Guacamole from 'guacamole-common-js';
import React, { useRef, useEffect } from 'react';

const GuacamoleClient = ({token} : {token : string}) => {
  const myRef = useRef(null);


  const tunnel = new Guacamole.WebSocketTunnel('ws://localhost:8080/');
  const client = new Guacamole.Client(tunnel);

  useEffect(() => {
    myRef.current.appendChild(client.getDisplay().getElement());
    client.connect('token=' + token);
  }, []);

  return <div ref={myRef} />;
};

export default GuacamoleClient;
