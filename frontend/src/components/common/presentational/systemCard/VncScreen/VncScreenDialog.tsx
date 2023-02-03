import React, { useEffect, useRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { VncScreen } from "react-vnc";

interface VncScreenProps {
  openModal: boolean;
  handleModalClose: () => void;
  systemId: number;
  organizationId: number;
}

const VncScreenDialog = ({ openModal, handleModalClose }: VncScreenProps) => {
  const vncScreenRef = useRef<React.ElementRef<typeof VncScreen>>(null);
  const { connect, connected, disconnect } = vncScreenRef.current ?? {};
  useEffect(() => {
    if (connected) {
      disconnect?.();
    } else {
      connect?.();
    }
  }, []);
  const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <>
      <Dialog
        maxWidth="lg"
        open={openModal}
        onClose={handleModalClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleModalClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              VNC
            </Typography>
          </Toolbar>
        </AppBar>
        <VncScreen
          url={
            "wss://5c94-124-109-46-126.in.ngrok.io/vnc.html?resize=remote&autoconnect=true&password=pakarmy.3"
          }
          scaleViewport
          background="#000000"
          style={{
            width: "75vw",
            height: "75vh",
          }}
          debug
          ref={vncScreenRef}
        />
      </Dialog>
    </>
  );
};

export default VncScreenDialog;
