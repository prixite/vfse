import { Fragment } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Name", width: 230 },
  { field: "is_default", headerName: "Default?", width: 230 },
];

export default function Organization() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const refresh = () => {
    fetch("/api/organizations/")
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
        setIsLoaded(true);
      });
  };

  const add = (data) => {
    fetch("/api/organizations/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.forms.csrf.csrfmiddlewaretoken.value,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        handleClose();
        refresh();
      });
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <Fragment>
      <h2>3rd Party Administration</h2>

      <Button onClick={handleOpen} variant="contained">
        Add Organization
      </Button>

      <AddOrganization add={add} open={open} handleClose={handleClose} />

      <div style={{ marginTop: "10px", height: 400, width: "100%" }}>
        <DataGrid
          rows={items}
          columns={columns}
          loading={!isLoaded}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    </Fragment>
  );
}

function AddOrganization(props) {
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
