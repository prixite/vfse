import React, { useEffect, useRef } from "react";

import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Box,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { VncScreen } from "react-vnc";

import { api } from "@src/store/reducers/api";
interface VncScreenProps {
  openModal: boolean;
  handleModalClose: () => void;
  systemId: number;
  organizationId: number;
}

const VncScreenDialog = ({
  openModal,
  handleModalClose,
  organizationId,
  systemId,
}: VncScreenProps) => {
  const vncScreenRef = useRef<React.ElementRef<typeof VncScreen>>(null);
  const { connect, connected, disconnect } = vncScreenRef.current ?? {};
  const { data, isLoading } = api.useGetVncQuery({
    organization_id: organizationId.toString(),
    systemId: systemId.toString(),
  });
  useEffect(() => {
    if (!isLoading) {
      if (connected) {
        disconnect?.();
      } else {
        connect?.();
      }
    }
  }, [isLoading]);
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
        {isLoading ? (
          <Box
            component="div"
            sx={{
              height: "75vh",
              width: "75vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p>Loading...</p>
          </Box>
        ) : (
          <>
            {data?.vnc_url ? (
              <VncScreen
                url={data.vnc_url}
                scaleViewport
                background="#000000"
                style={{
                  width: "75vw",
                  height: "75vh",
                }}
                debug
                ref={vncScreenRef}
              />
            ) : (
              <Box
                component="div"
                sx={{
                  height: "75vh",
                  width: "75vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p>Must specify URL, WebSocket or RTCDataChannel</p>
              </Box>
            )}
          </>
        )}
      </Dialog>
    </>
  );
};

export default VncScreenDialog;
