import { useState } from "react";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function AddOrganization(props) {
  const [value, setValue] = useState("");
  const onChange = (event) => setValue(event.target.value);

  const handleSave = (event) => {
    props.add({ name: value });
  };

  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>New Organization</DialogTitle>
      <DialogContent>
        <DialogContentText>Add new organization.</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
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
