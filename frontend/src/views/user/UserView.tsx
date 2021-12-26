import { Fragment, useState, useEffect } from "react";

import { Menu, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";

import ThreeDots from "@src/assets/svgs/three-dots.svg";
import AddUser from "@src/components/common/Smart/AddUser/AddUser";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsUsersListQuery } from "@src/store/reducers/api";
import "@src/views/user/UserView.scss";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 70,
    hide: false,
    disableColumnMenu: true,
  },
  {
    field: "username",
    headerName: "Name",
    width: 230,
    hide: false,
    disableColumnMenu: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
    hide: false,
    disableColumnMenu: true,
  },
];

export default function UserView() {
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(14);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const constantData: object = localizedData()?.users;
  const { addUser, userAdministration } = constantData;
  const [tableColumns, setTableColumns] = useState(columns);
  const [anchorEl, setAnchorEl] = useState(null);
  const openModal = Boolean(anchorEl);

  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const {
    data: items,
    refetch,
    isLoading,
  } = useOrganizationsUsersListQuery({
    organizationPk: selectedOrganization.id.toString(),
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
  };
  const handleEditAppearance = () => {
    setOpen(true);
    setOrganization(row);
  };

  return (
    <Fragment>
      <h2>{userAdministration}</h2>

      {/* <Button onClick={handleOpen} variant="contained">
        {addUser}
      </Button> */}
      <TopViewBtns
        setOpen={setOpen}
        path="users"
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
      />

      {/* <AddUser add={add} open={open} handleClose={handleClose} /> */}

      <div style={{ marginTop: "32px", overflow: "hidden" }}>
        <DataGrid
          rows={items}
          autoHeight
          columns={[
            ...tableColumns,
            {
              field: "Actions",
              headerAlign: "center",
              align: "center",
              disableColumnMenu: true,
              renderCell: () => (
                <img
                  src={ThreeDots}
                  onClick={handleClick}
                  style={{ cursor: "pointer" }}
                />
              ),
            },
          ]}
          loading={isLoading}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[14, 16, 18, 20]}
        />
      </div>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="client-options-button"
        anchorEl={anchorEl}
        open={openModal}
        className="UserDropdownMenu"
        onClose={handleActionClose}
      >
        <MenuItem onClick={handleEditAppearance}>Edit appearance</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Status</MenuItem>
      </Menu>
    </Fragment>
  );
}
