import React, { useEffect, useRef, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { AppBar, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { toast } from "react-toastify";

import { timeOut } from "@src/helpers/utils/constants";
import { useSelectedOrganization } from "@src/store/hooks";
import { Organization } from "@src/store/reducers/api";
import { System } from "@src/store/reducers/generated";
import {TerminalScreen} from "@src/components/terminalScreen/TerminalScreen";

interface TerminalScreenProps {
  openModal: boolean;
  handleModalClose: () => void;
  system: System;
}

const TerminalScreenDialog = ({
  openModal,
  handleModalClose,
  system,
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
              Control
            </Typography>
          </Toolbar>
        </AppBar>
        <TerminalScreen system={system} protocol="telnet" />
      </Dialog>
    </>
  );
};

export default TerminalScreenDialog;
