import { useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { localizedData } from "@src/helpers/utils/language";

export default function AddUser(props) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const constantData: object = localizedData()?.users?.popUp;
  const { emailText, userNameText, addNewUser, newUser, btnAdd, btnCancel } =
    constantData;

  const handleSave = (event) => {
    props.add({ username, email });
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>{newUser}</DialogTitle>
      <DialogContent>
        <DialogContentText>{`${addNewUser}.`}</DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          id="username"
          label={userNameText}
          type="text"
          fullWidth
          variant="standard"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />

        <TextField
          margin="dense"
          id="email"
          label={emailText}
          type="text"
          fullWidth
          variant="standard"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>{btnCancel}</Button>
        <Button onClick={handleSave}>{btnAdd}</Button>
      </DialogActions>
    </Dialog>
  );
}
