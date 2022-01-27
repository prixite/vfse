import { Fragment, useState, useEffect } from "react";

import { Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import ThreeDots from "@src/assets/svgs/three-dots.svg";
import TopViewBtns from "@src/components/common/Smart/TopViewBtns/TopViewBtns";
import NoDataFound from "@src/components/shared/NoDataFound/NoDataFound";
import ListModal from "@src/components/shared/popUps/ListModal/ListModal";
import UserModal from "@src/components/shared/popUps/UserModal/UserModal";
import { localizedData } from "@src/helpers/utils/language";
import {
  deactivateUserService,
  activateUserService,
} from "@src/services/userService";
import { useAppSelector } from "@src/store/hooks";
import {
  useOrganizationsUsersListQuery,
  useUsersActivatePartialUpdateMutation,
  useUsersDeactivatePartialUpdateMutation,
} from "@src/store/reducers/api";
import "@src/views/user/UserView.scss";

const columns = [
  {
    field: "first_name",
    headerName: "First Name",
    width: 220,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "last_name",
    headerName: "Last Name",
    width: 220,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "username",
    headerName: "Username",
    width: 220,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "email",
    headerName: "Email",
    width: 270,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 160,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "role",
    headerName: "Role",
    width: 100,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "manager",
    headerName: "Manager",
    width: 180,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
];

const headers = [
  {
    field: "first_name",
    headerName: "First Name",
    width: 220,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "last_name",
    headerName: "Last Name",
    width: 220,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "username",
    headerName: "Username",
    width: 220,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "email",
    headerName: "Email",
    width: 270,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "phone",
    headerName: "Phone",
    width: 160,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "role",
    headerName: "Role",
    width: 100,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    field: "manager",
    headerName: "Manager",
    width: 180,
    hide: false,
    disableColumnMenu: true,
    sortable: false,
  },
  {
    headerName: "Customer",
    hide: false,
  },
  {
    headerName: "Modalities",
    hide: false,
  },
  {
    headerName: "Sites",
    hide: false,
  },
  {
    headerName: "Status",
    hide: false,
  },
];

// const temp = ["abcdefg", "abcdg", "abcdefghijk"];

export default function UserSection() {
  const [pageSize, setPageSize] = useState(14);
  const { userAdministration } = localizedData().users;
  const [open, setOpen] = useState(false);
  const [tableColumns, setTableColumns] = useState(headers);
  const [columnHeaders, setColumnHeaders] = useState(columns);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const openModal = Boolean(anchorEl);
  const [hasData, setHasData] = useState(false);
  const [hideCustomer, setHideCustomer] = useState(false);
  const [hideModality, setHideModality] = useState(false);
  const [hideNetwork, setHideNetwork] = useState(false);
  const [hideStatus, setHideStatus] = useState(false);
  const [openListModal, setOpenListModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalList, setModalList] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState(null);
  const { searching } = localizedData().common;
  const [userDeactivateMutation] = useUsersDeactivatePartialUpdateMutation();
  const [userActivateMutation] = useUsersActivatePartialUpdateMutation();

  const { noDataDescription, noDataTitle } = localizedData().organization;

  const { lock, unlock, edit } = localizedData().user_menu_options;

  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );
  const {
    data: items,
    isLoading,
    refetch: usersRefetch,
    isFetching: isUserListFetching,
  } = useOrganizationsUsersListQuery({
    id: selectedOrganization.id.toString(),
  });

  const [userList, setUserList] = useState({});

  useEffect(() => {
    if (searchText?.length > 2 && userList && userList?.results?.length) {
      setHasData(true);
    } else if (items?.length && searchText?.length <= 2) {
      setHasData(true);
    } else {
      setHasData(false);
    }
  }, [searchText, userList, items]);

  useEffect(() => {
    if (tableColumns[7]?.hide === true) {
      setHideCustomer(true);
    } else {
      setHideCustomer(false);
    }
    if (tableColumns[8]?.hide === true) {
      setHideModality(true);
    } else {
      setHideModality(false);
    }
    if (tableColumns[9]?.hide === true) {
      setHideNetwork(true);
    } else {
      setHideNetwork(false);
    }
    if (tableColumns[10]?.hide === true) {
      setHideStatus(true);
    } else {
      setHideStatus(false);
    }
    const header = [
      tableColumns[0],
      tableColumns[1],
      tableColumns[2],
      tableColumns[3],
      tableColumns[4],
      tableColumns[5],
      tableColumns[6],
    ];
    setColumnHeaders(header);
  }, [tableColumns]);

  if (isLoading) {
    return <p>Loading</p>;
  }

  const handleClick = (event, id, active) => {
    setCurrentUser(id);
    setStatus(active);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setOpen(false);

  const handleModalClose = () => {
    setOpenListModal(false);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setCurrentUser(null);
  };

  const deactivateUser = async (id) => {
    await deactivateUserService(id, userDeactivateMutation, usersRefetch);
    handleActionClose();
  };

  const activateUser = async (id) => {
    await activateUserService(id, userActivateMutation, usersRefetch);
    handleActionClose();
  };

  const editUserModal = async () => {
    setOpen(true);
  };

  const renderModalities = (modalities) => {
    return (
      <div className="modality-section">
        {modalities.map((modality, index) => (
          <div key={index} className="modality">
            {modality}
          </div>
        ))}
      </div>
    );
  };

  const renderCustomers = (customers) => {
    return (
      <div>{customers?.length > 1 ? `${customers[0]},...` : customers[0]}</div>
    );
  };

  const handleModalClick = (name, list) => {
    setModalHeader(name);
    setModalList(list);
    setOpenListModal(true);
  };

  return (
    <Fragment>
      <h2>{userAdministration}</h2>
      {!isUserListFetching ? (
        <TopViewBtns
          setOpen={setOpen}
          path="users"
          tableColumns={tableColumns}
          setTableColumns={setTableColumns}
          setList={setUserList}
          actualData={items}
          searchText={searchText}
          setSearchText={setSearchText}
          hasData={hasData}
        />
      ) : (
        ""
      )}

      {open && (
        <UserModal
          open={open}
          handleClose={handleClose}
          selectedUser={currentUser}
          usersData={items}
          action={currentUser ? "edit" : "add"}
          refetch={usersRefetch}
        />
      )}

      <div
        style={{ marginTop: "32px", overflow: "hidden" }}
        className="user-section"
      >
        {searchText?.length > 2 ? (
          userList &&
          userList?.results?.length &&
          userList?.query === searchText ? (
            <DataGrid
              rows={userList?.results}
              autoHeight
              columns={[
                ...columnHeaders,
                {
                  field: "Customer",
                  hide: hideCustomer,
                  disableColumnMenu: true,
                  sortable: false,
                  width: 170,
                  renderCell: (cellValues) => (
                    <div
                      onClick={
                        cellValues?.row?.organizations?.length > 1
                          ? () =>
                              handleModalClick(
                                "Customers",
                                cellValues?.row?.organizations
                              )
                          : undefined
                      }
                      style={{
                        cursor: `${
                          cellValues?.row?.organizations?.length > 1
                            ? "pointer"
                            : ""
                        }`,
                      }}
                    >
                      {renderCustomers(cellValues?.row?.organizations)}
                    </div>
                  ),
                },
                {
                  field: "Modalities",
                  hide: hideModality,
                  disableColumnMenu: true,
                  sortable: false,
                  width: 280,
                  renderCell: (cellValues) =>
                    renderModalities(cellValues.row.modalities),
                },
                {
                  field: "Sites",
                  hide: hideNetwork,
                  disableColumnMenu: true,
                  sortable: false,
                  width: 190,
                  renderCell: (cellValues) => (
                    <div
                      onClick={
                        cellValues?.row?.health_networks?.length > 1
                          ? () =>
                              handleModalClick(
                                "Sites",
                                cellValues?.row?.health_networks
                              )
                          : undefined
                      }
                      style={{
                        cursor: `${
                          cellValues?.row?.health_networks?.length > 1
                            ? "pointer"
                            : ""
                        }`,
                      }}
                    >
                      {renderCustomers(cellValues?.row?.health_networks)}
                    </div>
                  ),
                },
                {
                  field: "Status",
                  hide: hideStatus,
                  disableColumnMenu: true,
                  sortable: false,
                  width: 100,
                  renderCell: (cellValues) => (
                    <span
                      style={{
                        color: `${cellValues.row.is_active ? "" : "red"}`,
                      }}
                    >
                      {cellValues.row.is_active ? "Active" : "Locked"}
                    </span>
                  ),
                },
                {
                  field: "Actions",
                  headerAlign: "center",
                  align: "center",
                  disableColumnMenu: true,
                  width: 85,
                  sortable: false,
                  renderCell: (cellValues) => (
                    <div
                      onClick={(e) =>
                        handleClick(
                          e,
                          cellValues.row.id,
                          cellValues.row.is_active
                        )
                      }
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
            <div
              style={{
                color: "gray",
                marginLeft: "45%",
                marginTop: "20%",
              }}
            >
              <h2>{searching}</h2>
            </div>
          )
        ) : items && items?.length ? (
          <DataGrid
            rows={items}
            autoHeight
            columns={[
              ...columnHeaders,
              {
                field: "Customer",
                hide: hideCustomer,
                disableColumnMenu: true,
                sortable: false,
                width: 170,
                renderCell: (cellValues) => (
                  <div
                    onClick={
                      cellValues?.row?.organizations?.length > 1
                        ? () =>
                            handleModalClick(
                              "Customers",
                              cellValues?.row?.organizations
                            )
                        : undefined
                    }
                    style={{
                      cursor: `${
                        cellValues?.row?.organizations?.length > 1
                          ? "pointer"
                          : ""
                      }`,
                    }}
                  >
                    {renderCustomers(cellValues?.row?.organizations)}
                  </div>
                ),
              },
              {
                field: "Modalities",
                hide: hideModality,
                disableColumnMenu: true,
                sortable: false,
                width: 280,
                renderCell: (cellValues) =>
                  renderModalities(cellValues.row.modalities),
              },
              {
                field: "Sites",
                hide: hideNetwork,
                disableColumnMenu: true,
                sortable: false,
                width: 190,
                renderCell: (cellValues) => (
                  <div
                    onClick={
                      cellValues?.row?.health_networks?.length > 1
                        ? () =>
                            handleModalClick(
                              "Sites",
                              cellValues?.row?.health_networks
                            )
                        : undefined
                    }
                    style={{
                      cursor: `${
                        cellValues?.row?.health_networks?.length > 1
                          ? "pointer"
                          : ""
                      }`,
                    }}
                  >
                    {renderCustomers(cellValues?.row?.health_networks)}
                  </div>
                ),
              },
              {
                field: "Status",
                hide: hideStatus,
                disableColumnMenu: true,
                sortable: false,
                width: 100,
                renderCell: (cellValues) => (
                  <span
                    style={{
                      color: `${cellValues.row.is_active ? "" : "red"}`,
                    }}
                  >
                    {cellValues.row.is_active ? "Active" : "Locked"}
                  </span>
                ),
              },
              {
                field: "Actions",
                headerAlign: "center",
                align: "center",
                disableColumnMenu: true,
                width: 85,
                sortable: false,
                renderCell: (cellValues) => (
                  <div
                    onClick={(e) =>
                      handleClick(
                        e,
                        cellValues.row.id,
                        cellValues.row.is_active
                      )
                    }
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
        {status ? (
          <MenuItem onClick={() => deactivateUser(currentUser)}>
            {lock}
          </MenuItem>
        ) : (
          <MenuItem onClick={() => activateUser(currentUser)}>
            {unlock}
          </MenuItem>
        )}
        <MenuItem onClick={() => editUserModal()}>{edit}</MenuItem>
      </Menu>
      <ListModal
        name={modalHeader}
        list={modalList}
        open={openListModal}
        handleClose={handleModalClose}
      />
    </Fragment>
  );
}
