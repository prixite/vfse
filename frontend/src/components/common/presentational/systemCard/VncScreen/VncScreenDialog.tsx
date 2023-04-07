import React, { useEffect, useRef, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { AppBar, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { toast } from "react-toastify";
import { VncScreen } from "react-vnc";

import { timeOut } from "@src/helpers/utils/constants";
import { useSelectedOrganization } from "@src/store/hooks";
import { Organization } from "@src/store/reducers/api";
import { System } from "@src/store/reducers/generated";

interface VncScreenProps {
  openModal: boolean;
  handleModalClose: () => void;
  openPasswordModal: () => void;
  system: System;
  organizationId: number;
  password: string;
}

const VncScreenDialog = ({
  openModal,
  handleModalClose,
  openPasswordModal,
  system,
  password,
}: VncScreenProps) => {
  const selectedOrganization: Organization = useSelectedOrganization();
  const vncScreenRef = useRef<React.ElementRef<typeof VncScreen>>(null);
  const { connect, connected, disconnect } = vncScreenRef.current ?? {};
  const [fullScreen, setFullScreen] = useState(false);
  const {
    access_url: accessUrl,
    vnc_port: vncPort,
    ip_address: ipAddress,
  } = system;

  const websockifyUrl = `${process.env.WEBSOCKIFY_WS}${
    selectedOrganization.id
  }/${system.id}?host=${accessUrl || ipAddress}&port=${vncPort}`;

  const RfbOptions = {
    shared: true,
    credentials: {
      password: password,
    },
  };
  useEffect(() => {
    if (connected) {
      disconnect?.();
    } else {
      connect?.();
    }
  }, []);

  const securityFailure = (e) => {
    e?.detail?.status === 1 && e?.detail?.reason === "Authentication failure";
    {
      toast.error("Incorrect password", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
      handleModalClose();
      openPasswordModal();
    }
  };

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
        classes={{ paperFullScreen: `${fullScreen ? "" : "prePrint"}` }}
        open={openModal}
        onClose={handleModalClose}
        TransitionComponent={Transition}
        fullScreen={fullScreen}
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
              Control
            </Typography>
            {!fullScreen ? (
              <FullscreenIcon
                style={{ cursor: "pointer" }}
                onClick={() => setFullScreen(true)}
              />
            ) : (
              <FullscreenExitIcon
                style={{ cursor: "pointer" }}
                onClick={() => setFullScreen(false)}
              />
            )}
          </Toolbar>
        </AppBar>
        <VncScreen
          url={websockifyUrl}
          scaleViewport={true}
          background="#000000"
          onSecurityFailure={(e) => securityFailure(e)}
          style={{
            width: `${fullScreen ? "100vw" : "60vw"}`,
            height: `${fullScreen ? "100%" : "75vh"}`,
          }}
          rfbOptions={RfbOptions}
          ref={vncScreenRef}
        />
      </Dialog>
    </>
  );
};

export default VncScreenDialog;
