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
import { getUrl, sendRequest } from "@src/http";

function add(data, setItems) {
  const url = "/api/organizations/";
  sendRequest(url, "POST", data)
    .then((response) => response.json())
    .then((result) => {
      getUrl(url, setItems);
    });
}

function createDelete(setItems) {
  return (id: number) => {
    sendRequest(`/api/organizations/${id}/`, "DELETE", {})
      .then((response) => response.json())
      .then((result) => {
        getUrl("/api/organizations/", setItems);
      });
  };
}

export default function Organization() {
  const [items, setItems] = useState([]);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleAdd = (data) => {
    add(data, setItems);
    handleClose();
  };

  useEffect(() => {
    getUrl("/api/organizations/", setItems);
  }, []);

  return (
    <Fragment>
      <h2>3rd Party Administration</h2>

      <Button onClick={() => setOpen(true)} variant="contained">
        Add Client
      </Button>

      <AddOrganizationModal
        add={handleAdd}
        open={open}
        handleClose={handleClose}
      />

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
                <TableCell align="right">
                  <Button onClick={() => createDelete(row.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}
