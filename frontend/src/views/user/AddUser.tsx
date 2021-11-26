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
  const [email, setEmail] = useState("");

  const handleSave = (event) => {
    props.add({ username, email });
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
          onChange={(event) => setUsername(event.target.value)}
        />

        <TextField
          margin="dense"
          id="email"
          label="Email"
          type="text"
          fullWidth
          variant="standard"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
