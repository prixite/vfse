import { Fragment, useState, useEffect } from "react";

import { Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";

import ThreeDots from "@src/assets/svgs/three-dots.svg";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import UserSectionMobile from "@src/components/common/smart/userSection/userSectionMobile/UserSectionMobile";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import ListModal from "@src/components/shared/popUps/listModal/ListModal";
import UserModal from "@src/components/shared/popUps/userModal/UserModal";
import { mobileWidth } from "@src/helpers/utils/config";
import { timeOut } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import constantsData from "@src/localization/en.json";
import {
  deactivateUserService,
  activateUserService,
} from "@src/services/userService";
import { useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsModalitiesListQuery,
  useOrganizationsListQuery,
  useScopeUsersListQuery,
  User,
  useUsersActivatePartialUpdateMutation,
  useUsersDeactivatePartialUpdateMutation,
  useUsersRolesListQuery,
} from "@src/store/reducers/api";

import "@src/views/user/userView.scss";
import "@src/components/common/smart/userSection/userSection.scss";

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
  // {
  //   field: "manager",
  //   headerName: "Manager",
  //   width: 180,
  //   hide: false,
  //   disableColumnMenu: true,
  //   sortable: false,
  // },
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
    headerName: "Role",
    hide: false,
  },
  {
    headerName: "Manager",
    hide: false,
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
  const [query, setQuery] = useState("");
  const openModal = Boolean(anchorEl);
  const [hasData, setHasData] = useState(false);
  const [hideManager, setHideManager] = useState(false);
  const [hideCustomer, setHideCustomer] = useState(false);
  const [hideModality, setHideModality] = useState(false);
  const [hideNetwork, setHideNetwork] = useState(false);
  const [hideStatus, setHideStatus] = useState(false);
  const [openListModal, setOpenListModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalList, setModalList] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [browserWidth] = useWindowSize();
  const { searching } = localizedData().common;
  const [userDeactivateMutation] = useUsersDeactivatePartialUpdateMutation();
  const [userActivateMutation] = useUsersActivatePartialUpdateMutation();
  const { toastData } = constantsData;
  const { loading } = constantsData.common;

  const { noDataDescription, noDataTitle } = localizedData().organization;

  const { lock, unlock, edit } = localizedData().user_menu_options;

  const selectedOrganization = useSelectedOrganization();
  const { data: items, isLoading: isUsersLoading } = useScopeUsersListQuery({
    id: selectedOrganization?.id?.toString(),
  });

  const { data: usersRoles } = useUsersRolesListQuery();

  const { data: modalitiesList } = useOrganizationsModalitiesListQuery(
    { id: selectedOrganization?.id?.toString() },
    { skip: !selectedOrganization }
  );

  const { data: organizationData } = useOrganizationsListQuery({ page: 1 });

  const [userList, setUserList] = useState({});
  const [itemsList, setItemsList] = useState<Array<User>>([]);
  useEffect(() => {
    if (query?.trim()?.length > 2 && userList) {
      setHasData(true);
      setItemsList(itemsList);
      handleSearchQuery(query);
    } else if (items?.length && query?.length <= 2) {
      setHasData(true);
      setItemsList(items);
    } else {
      setHasData(false);
    }
  }, [query, userList, items]);

  useEffect(() => {
    if (tableColumns[6]?.hide === true) {
      setHideManager(true);
    } else {
      setHideManager(false);
    }
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
    ];
    setColumnHeaders(header);
  }, [tableColumns]);

  if (isUsersLoading) {
    return <p>Loading</p>;
  }

  const handleSearchQuery = async (searchQuery: string) => {
    const itemsToBeSet = [
      ...items.filter((user) => {
        return (
          (
            user?.first_name +
            user?.last_name +
            user?.username +
            user?.email +
            user?.phone +
            user?.manager?.name +
            user?.manager?.email
          )
            ?.trim()
            .toLowerCase()
            .search(searchQuery?.trim().toLowerCase()) != -1
        );
      }),
    ];
    if (items && items.length) {
      await Promise.all([itemsToBeSet, setItemsList(itemsToBeSet)]);
    }
  };

  const handleClick = (event, id, active) => {
    setCurrentUser(id);
    setStatus(active);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    handleActionClose();
  };

  const handleModalClose = () => {
    setOpenListModal(false);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setCurrentUser(null);
  };

  const deactivateUser = async (id) => {
    await deactivateUserService(id, userDeactivateMutation);
    toast.success(toastData.userSectionLocked, {
      autoClose: timeOut,
      pauseOnHover: false,
    });
    handleActionClose();
  };

  const activateUser = async (id) => {
    await activateUserService(id, userActivateMutation);
    toast.success(toastData.userSectionUnlocked, {
      autoClose: timeOut,
      pauseOnHover: false,
    });
    handleActionClose();
  };

  const editUserModal = async () => {
    setOpen(true);
  };

  const renderModalities = (modalities) => {
    return (
      <div className="modality-section">
        {modalities?.map((modality, index) => (
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
      <TopViewBtns
        setOpen={setOpen}
        path="users"
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
        setList={setUserList}
        handleSearchQuery={handleSearchQuery}
        searchText={query}
        setSearchText={setQuery}
        actualData={items}
        hasData={hasData}
      />

      {open && !isUsersLoading && (
        <UserModal
          open={open}
          handleClose={handleClose}
          selectedUser={currentUser}
          usersData={items}
          roles={usersRoles}
          action={currentUser ? "edit" : "add"}
          organizationData={organizationData}
          modalitiesList={modalitiesList}
        />
      )}

      <div
        style={{ marginTop: "32px", overflow: "hidden" }}
        className="user-section"
      >
        {itemsList && itemsList?.length ? (
          <>
            {browserWidth > mobileWidth ? (
              <DataGrid
                rows={itemsList}
                autoHeight
                columns={[
                  ...columnHeaders,
                  {
                    field: "Role",
                    disableColumnMenu: true,
                    sortable: false,
                    width: 180,
                    hide: false,
                    renderCell: (cellValues) =>
                      usersRoles?.find(
                        (x) => x?.value === cellValues?.row?.role[0]
                      )?.title,
                  },
                  {
                    field: "Manager",
                    hide: hideManager,
                    disableColumnMenu: true,
                    sortable: false,
                    width: 180,
                    renderCell: (cellValues) => (
                      <div>{cellValues.row.manager?.name}</div>
                    ),
                  },
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
                          cellValues?.row?.sites?.length > 1
                            ? () =>
                                handleModalClick(
                                  "Sites",
                                  cellValues?.row?.sites
                                )
                            : undefined
                        }
                        style={{
                          cursor: `${
                            cellValues?.row?.sites?.length > 1 ? "pointer" : ""
                          }`,
                        }}
                      >
                        {renderCustomers(cellValues?.row?.sites)}
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
                loading={isUsersLoading}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[14, 16, 18, 20]}
              />
            ) : (
              <UserSectionMobile
                userList={itemsList}
                handleClick={handleClick}
              />
            )}
          </>
        ) : (
          <NoDataFound title={noDataTitle} description={noDataDescription} />
        )}
        {isUsersLoading ? (
          <div
            style={{
              color: "gray",
              marginLeft: "45%",
              marginTop: "20%",
            }}
          >
            <h2>{query?.trim().length > 2 ? searching : loading}</h2>
          </div>
        ) : (
          ""
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
