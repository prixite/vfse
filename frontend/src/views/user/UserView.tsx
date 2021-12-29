import { Fragment, useState } from "react";

import { Menu, MenuItem } from "@mui/material";
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
  const [pageSize, setPageSize] = useState(14);
  const { userAdministration } = localizedData().users;
  const [open, setOpen] = useState(false);
  const [tableColumns, setTableColumns] = useState(columns);
  const [anchorEl, setAnchorEl] = useState(null);
  const openModal = Boolean(anchorEl);

  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const { data: items, isLoading } = useOrganizationsUsersListQuery({
    organizationPk: selectedOrganization.id.toString(),
  });

  if (isLoading) {
    return <p>Loading</p>;
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setOpen(false);

  const handleActionClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <h2>{userAdministration}</h2>

      <TopViewBtns
        setOpen={setOpen}
        path="users"
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
      />

      <AddUser open={open} handleClose={handleClose} />

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
        <MenuItem>Delete</MenuItem>
        <MenuItem>Status</MenuItem>
      </Menu>
    </Fragment>
  );
}
