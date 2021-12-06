import { Fragment } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import Button from "@mui/material/Button";
import OrganizationModal from "@src/components/Smart/OrganizationModal/OrganizationModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  useOrganizationsListQuery,
  useOrganizationsDeleteMutation,
} from "@src/store/reducers/api";

export default function OrganizationView() {
  const [organization, setOrganization] = useState(null);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const { data: items, refetch, isLoading } = useOrganizationsListQuery();
  const [deleteOrganization] = useOrganizationsDeleteMutation();

  if (isLoading) {
    return <p>Loading</p>;
  }

  return (
    <Fragment>
      <h2>3rd Party Administration</h2>
      <Button
        onClick={() => {
          setOpen(true);
          setOrganization(null);
        }}
        variant="contained"
      >
        Add Client
      </Button>

      <OrganizationModal
        organization={organization}
        setOrganization={setOrganization}
        open={open}
        handleClose={handleClose}
        refetch={refetch}
      />

      <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Number of seats</TableCell>
              <TableCell align="right">Is Default?</TableCell>
              <TableCell align="right">Delete</TableCell>
              <TableCell align="right">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell scope="row">{row.name}</TableCell>
                <TableCell align="right">{row.number_of_seats}</TableCell>
                <TableCell align="right">{row.is_default.toString()}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={async () => {
                      await deleteOrganization({
                        id: row.id.toString(),
                      }).unwrap();
                      toast.success("Organization successfully deleted");
                      refetch();
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => {
                      setOpen(true);
                      setOrganization(row);
                    }}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}
