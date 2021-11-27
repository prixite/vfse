import { Fragment } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

import AddOrganizationModal from "@src/views/organization/AddOrganizationModal";

export default function Organization() {
  const [items, setItems] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const refresh = () => {
    fetch("/api/organizations/")
      .then((response) => response.json())
      .then((result) => {
        setItems(result);
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

  const deleteOrganization = (id) => {
    fetch(`/api/organizations/${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.forms.csrf.csrfmiddlewaretoken.value,
      },
    })
      .then((response) => response.json())
      .then((result) => {
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
        Add Client
      </Button>

      <AddOrganizationModal add={add} open={open} handleClose={handleClose} />

      <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Is Default?</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">{row.name}</TableCell>
                <TableCell align="right">{row.is_default.toString()}</TableCell>
                <TableCell align="right"><Button onClick={deleteOrganization(row.id)}>Delete</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}
