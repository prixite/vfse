import { useState } from "react";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function AddUser(props) {
  const [username, setUsername] = useState("");
  const onUsernameChange = (event) => setUsername(event.target.value);

  const handleSave = (event) => {
    props.add({ name: value });
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>New User</DialogTitle>
      <DialogContent>
        <DialogContentText>Add new user.</DialogContentText>

        <TextField
          autoFocus
          margin="dense"
          id="username"
          label="Username"
          type="text"
          fullWidth
          variant="standard"
          value={username}
          onChange={onChange}
        />

        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email"
          type="text"
          fullWidth
          variant="standard"
          value={value}
          onChange={onChange}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
