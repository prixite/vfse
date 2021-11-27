import { useState } from "react";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function AddOrganizationModal(props) {
  const [value, setValue] = useState({});

  const handleSave = (event) => {
    props.add(value);
  };

  console.log(value);

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
          value={value["name"]}
          onChange={(event) => setValue({...value, name: event.target.value})}
        />
        <TextField
          margin="dense"
          id="seats"
          label="Number of seats"
          type="text"
          fullWidth
          variant="standard"
          value={value["number_of_seats"]}
          onChange={(event) => setValue({...value, "number_of_seats": event.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}
