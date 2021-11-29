import { Fragment } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import AddUser from "@src/views/user/AddUser";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "username", headerName: "Username", width: 230 },
  { field: "email", headerName: "Email", width: 230 },
];

export default function Organization() {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const refresh = () => {
    fetch("/api/users/")
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
        setIsLoaded(true);
      });
  };

  const add = (data) => {
    fetch("/api/users/", {
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
      <h2>User Administration</h2>

      <Button onClick={handleOpen} variant="contained">
        Add User
      </Button>

      <AddUser add={add} open={open} handleClose={handleClose} />

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
