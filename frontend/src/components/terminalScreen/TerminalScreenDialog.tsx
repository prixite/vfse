import React from "react";

import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import { TerminalScreen } from "@src/components/terminalScreen/TerminalScreen";
import { System } from "@src/store/reducers/generatedWrapper";

interface TerminalScreenProps {
  openModal: boolean;
  handleModalClose: () => void;
  system: System;
  protocol: "telnet" | "ssh";
}

const TerminalScreenDialog = ({
  openModal,
  handleModalClose,
  system,
  protocol,
}: TerminalScreenProps) => {
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
        classes={{ paperFullScreen: "prePrint" }}
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
              Terminal
            </Typography>
          </Toolbar>
        </AppBar>
        <TerminalScreen system={system} protocol={protocol} />
      </Dialog>
    </>
  );
};

export default TerminalScreenDialog;
