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
import { useSelector, useDispatch } from "react-redux";
import { setOrganizationData } from "@src/reducers/Organization";
import OrganizationModal from "@src/views/organization/OrganizationModal";
import { getUrl, sendRequest } from "@src/http";
import { ToastContainer, toast } from "react-toastify";
import "!style-loader!css-loader!react-toastify/dist/ReactToastify.css";
import { definitions } from "@src/schema";
import { RootState } from "@src/store/store";

type Organization = definitions["Organization"];

function getOrganizationData(dispatch) {
  getUrl("/api/organizations/", (result: Organization) =>
    dispatch(setOrganizationData(result))
  );
}

function add(data: Organization, dispatch) {
  const url = "/api/organizations/";
  sendRequest(url, "POST", data)
    .then((response) => response.json())
    .then(() => {
      getOrganizationData(dispatch);
    });
}

function edit(data: Organization, dispatch) {
  let { id, ...organization } = data;
  const url = `/api/organizations/${id}/`;
  sendRequest(url, "PATCH", organization)
    .then((response) => response.json())
    .then(() => {
      getOrganizationData(dispatch);
    });
}

function deleteOrganization(id: number, dispatch) {
  toast.success("Lorem ipsum dolor");
  // sendRequest(`/api/organizations/${id}/`, "DELETE", {}).then(() => {
  //   getOrganizationData(dispatch);
  // });
}

export default function Organization() {
  const [organization, setOrganization] = useState(null);
  const [open, setOpen] = useState(false);
  const items = useSelector(
    (state: RootState) => state.OrganizationReducer.value
  );
  const dispatch = useDispatch();
  const handleClose = () => setOpen(false);
  const handleSave = (data: Organization) => {
    data.id === undefined ? add(data, dispatch) : edit(data, dispatch);
    handleClose();
  };

  useEffect(() => {
    getUrl("/api/organizations/", (data) => {
      dispatch(setOrganizationData(data));
    });
  }, []);

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
        save={handleSave}
        organization={organization}
        setOrganization={setOrganization}
        open={open}
        handleClose={handleClose}
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
                  <Button onClick={() => deleteOrganization(row.id, dispatch)}>
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
