import { Fragment, useState, useEffect } from "react";

import { Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import ThreeDots from "@src/assets/svgs/three-dots.svg";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import UserSectionMobile from "@src/components/common/smart/userSection/userSectionMobile/UserSectionMobile";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import ListModal from "@src/components/shared/popUps/listModal/ListModal";
import UserModal from "@src/components/shared/popUps/userModal/UserModal";
import { mobileWidth } from "@src/helpers/utils/config";
import {
  timeOut,
  USER_TABLE_HEADERS,
  USER_TABLE_FIELDS,
} from "@src/helpers/utils/constants";
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

export default function UserSection() {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(14);
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [query, setQuery] = useState("");
  const openModal = Boolean(anchorEl);
  const [hasData, setHasData] = useState(false);
  const [openListModal, setOpenListModal] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalList, setModalList] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState(null);
  const [browserWidth] = useWindowSize();
  const [userDeactivateMutation] = useUsersDeactivatePartialUpdateMutation();
  const [userActivateMutation] = useUsersActivatePartialUpdateMutation();

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
    toast.success("User is locked.", {
      autoClose: timeOut,
      pauseOnHover: false,
    });
    handleActionClose();
  };

  const activateUser = async (id) => {
    await activateUserService(id, userActivateMutation);
    toast.success("User is unlocked", {
      autoClose: timeOut,
      pauseOnHover: false,
    });
    handleActionClose();
  };

  const editUserModal = async () => {
    setOpen(true);
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

  const headers = [
    {
      field: USER_TABLE_FIELDS.FIRST_NAME,
      headerName: USER_TABLE_HEADERS.FIRST_NAME,
      width: 220,
      hide: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: USER_TABLE_FIELDS.LAST_NAME,
      headerName: USER_TABLE_HEADERS.LAST_NAME,
      width: 220,
      hide: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: USER_TABLE_FIELDS.USERNAME,
      headerName: USER_TABLE_HEADERS.USERNAME,
      width: 220,
      hide: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: USER_TABLE_FIELDS.EMAIL,
      headerName: USER_TABLE_HEADERS.EMAIL,
      width: 270,
      hide: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: USER_TABLE_FIELDS.PHONE,
      headerName: USER_TABLE_HEADERS.PHONE,
      width: 160,
      hide: false,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: USER_TABLE_FIELDS.ROLE,
      headerName: USER_TABLE_HEADERS.ROLE,
      hide: false,
      renderCell: (cellValues) =>
        usersRoles?.find((x) => x?.value === cellValues?.row?.role[0])?.title,
    },
    {
      field: USER_TABLE_FIELDS.MANAGER,
      headerName: USER_TABLE_HEADERS.MANAGER,
      hide: false,
      renderCell: (cellValues) => <div>{cellValues.row.manager?.name}</div>,
    },
    {
      field: USER_TABLE_FIELDS.CUSTOMER,
      headerName: USER_TABLE_HEADERS.CUSTOMER,
      hide: false,
      renderCell: (cellValues) => (
        <div
          onClick={
            cellValues?.row?.organizations?.length > 1
              ? () =>
                  handleModalClick("Customers", cellValues?.row?.organizations)
              : undefined
          }
          style={{
            cursor: `${
              cellValues?.row?.organizations?.length > 1 ? "pointer" : ""
            }`,
          }}
        >
          {renderCustomers(cellValues?.row?.organizations)}
        </div>
      ),
    },
    {
      field: USER_TABLE_FIELDS.MODALITIES,
      headerName: USER_TABLE_HEADERS.MODALITIES,
      hide: false,
      renderCell: (cellValues) => (
        <div className="modalities-cell">
          {renderModalities(cellValues.row.modalities)}
        </div>
      ),
    },
    {
      field: USER_TABLE_FIELDS.SITES,
      headerName: USER_TABLE_HEADERS.SITES,
      hide: false,
      renderCell: (cellValues) => (
        <div
          onClick={
            cellValues?.row?.sites?.length > 1
              ? () => handleModalClick("Sites", cellValues?.row?.sites)
              : undefined
          }
          style={{
            cursor: `${cellValues?.row?.sites?.length > 1 ? "pointer" : ""}`,
          }}
        >
          {renderCustomers(cellValues?.row?.sites)}
        </div>
      ),
    },
    {
      field: USER_TABLE_FIELDS.STATUS,
      headerName: USER_TABLE_HEADERS.STATUS,
      hide: false,
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
  ];

  const [columnHeaders, setColumnHeaders] = useState(headers);

  return (
    <Fragment>
      <h2>{t("User Administration")}</h2>
      <TopViewBtns
        setOpen={setOpen}
        path="users"
        tableColumns={columnHeaders}
        setTableColumns={setColumnHeaders}
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
                  ...columnHeaders.filter((header) => !header.hide),
                  ...(columnHeaders.some((header) => header.hide === false)
                    ? [
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
                      ]
                    : []),
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
          <NoDataFound
            title={"Sorry! No results found. :("}
            description={"Try Again"}
          />
        )}
        {isUsersLoading ? (
          <div
            style={{
              color: "gray",
              marginLeft: "45%",
              marginTop: "20%",
            }}
          >
            <h2>{query?.trim().length > 2 ? "Searching..." : "Loading..."}</h2>
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
            {t("Lock")}
          </MenuItem>
        ) : (
          <MenuItem onClick={() => activateUser(currentUser)}>
            {t("Unlock")}
          </MenuItem>
        )}
        <MenuItem onClick={() => editUserModal()}>{t("Edit")}</MenuItem>
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
