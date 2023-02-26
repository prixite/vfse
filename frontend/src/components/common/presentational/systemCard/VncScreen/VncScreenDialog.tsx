import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import { AppBar, Dialog, IconButton, Toolbar, Typography } from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import { CredentialForm } from "@src/components/common/presentational/systemCard/VncScreen/CredentialForm";
import { VncScreen } from "@src/components/common/presentational/systemCard/VncScreen/VncScreen";
import { System } from "@src/store/reducers/generated";

interface VncScreenProps {
  openModal: boolean;
  handleModalClose: () => void;
  organizationId: number;
  system: System;
}

const VncScreenDialog = ({
  openModal,
  handleModalClose,
  system,
}: VncScreenProps) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

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
        {!(formData.username && formData.password) && (
          <CredentialForm
            setFormData={setFormData}
            handleModalClose={handleModalClose}
          />
        )}
        {formData.username && formData.password && (
          <VncScreen
            system={system}
            username={formData.username}
            password={formData.password}
          />
        )}
      </Dialog>
    </>
  );
};

export default VncScreenDialog;
