import { Fragment } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import Button from "@mui/material/Button";

import AddUser from "@src/components/common/Smart/AddUser/AddUser";
import { useOrganizationsUsersListQuery } from "@src/store/reducers/api";
import { useAppSelector } from "@src/store/hooks";
import { localizedData } from "@src/helpers/utils/language";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "username", headerName: "Username", width: 230 },
  { field: "email", headerName: "Email", width: 230 },
];

export default function UserView() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const constantData: object = localizedData();
  const { addUser, userAdministration } = constantData;

  const currentOrganization = useAppSelector(
    (state) => state.organization.currentOrganization
  );

  const {
    data: items,
    refetch,
    isLoading,
  } = useOrganizationsUsersListQuery({
    organizationPk: currentOrganization.id.toString(),
  });

  if (isLoading) {
    return <p>Loading</p>;
  }

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
        refetch();
      });
  };

  return (
    <Fragment>
      <h2>{userAdministration}</h2>

      <Button onClick={handleOpen} variant="contained">
        {addUser}
      </Button>

      <AddUser add={add} open={open} handleClose={handleClose} />

      <div style={{ marginTop: "10px", height: 400, width: "100%" }}>
        <DataGrid
          rows={items}
          columns={columns}
          loading={isLoading}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    </Fragment>
  );
}
