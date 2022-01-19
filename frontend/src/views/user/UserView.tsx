import { Fragment, useState } from "react";

import { Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import ThreeDots from "@src/assets/svgs/three-dots.svg";
import AddUser from "@src/components/common/Smart/AddUser/AddUser";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
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
    sortable: false,
  },
  {
    field: "username",
    headerName: "Name",
    width: 230,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
];

export default function UserView() {
  const [pageSize, setPageSize] = useState(14);
  const { userAdministration } = localizedData().users;
  const [open, setOpen] = useState(false);
  const [tableColumns, setTableColumns] = useState(columns);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const openModal = Boolean(anchorEl);

  const { noDataDescription, noDataTitle } = localizedData().organization;

  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const { data: items, isLoading } = useOrganizationsUsersListQuery({
    id: selectedOrganization.id.toString(),
  });

  const [userList, setUserList] = useState({});

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
        setList={setUserList}
        actualData={items}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      <AddUser open={open} handleClose={handleClose} />

      <div style={{ marginTop: "32px", overflow: "hidden" }}>
        {searchText?.length > 2 ? (
          userList &&
          userList?.results?.length &&
          userList?.query === searchText ? (
            <DataGrid
              rows={userList?.results}
              autoHeight
              columns={[
                ...tableColumns,
                {
                  field: "Actions",
                  headerAlign: "center",
                  align: "center",
                  disableColumnMenu: true,
                  sortable: false,
                  width: 85,
                  renderCell: () => (
                    <div
                      onClick={handleClick}
                      style={{
                        cursor: "pointer",
                        padding: "15px",
                        marginLeft: "auto",
                        marginTop: "10px",
                      }}
                    >
                      <img src={ThreeDots} />
                    </div>
                  ),
                },
              ]}
              loading={isLoading}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[14, 16, 18, 20]}
            />
          ) : userList?.query === searchText ? (
            <NoDataFound
              search
              setQuery={setSearchText}
              title={noDataTitle}
              description={noDataDescription}
            />
          ) : (
            ""
          )
        ) : items && items?.length ? (
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
                width: 85,
                sortable: false,
                renderCell: () => (
                  <div
                    onClick={handleClick}
                    style={{
                      cursor: "pointer",
                      padding: "15px",
                      marginLeft: "auto",
                      marginTop: "10px",
                    }}
                  >
                    <img src={ThreeDots} />
                  </div>
                ),
              },
            ]}
            loading={isLoading}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[14, 16, 18, 20]}
          />
        ) : (
          <NoDataFound title={noDataTitle} description={noDataDescription} />
        )}
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
