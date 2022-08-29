import { Fragment, useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import UserSectionMobile from "@src/components/common/smart/activeUsersSection/userSectionMobile/UserSectionMobile";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import UserModal from "@src/components/shared/popUps/userModal/UserModal";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";
import { useSelectedOrganization } from "@src/store/hooks";
import {
  useOrganizationsModalitiesListQuery,
  useOrganizationsListQuery,
  useScopeUsersListQuery,
  User,
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
    headerName: "Status",
    hide: false,
  },
];

// const temp = ["abcdefg", "abcdg", "abcdefghijk"];

export default function ActiveUserSection() {
  const [pageSize, setPageSize] = useState(14);
  const { userAdministration } = localizedData().users;
  const [open, setOpen] = useState(false);
  const [tableColumns, setTableColumns] = useState(headers);
  // eslint-disable-next-line
  const [columnHeaders, setColumnHeaders] = useState(columns);
  const [query, setQuery] = useState("");
  const [hasData, setHasData] = useState(false);
  // eslint-disable-next-line
  const [hideStatus, setHideStatus] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [browserWidth] = useWindowSize();
  const { searching } = localizedData().common;

  const { noDataDescription, noDataTitle } = localizedData().organization;

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

  const handleClose = () => {
    setOpen(false);
    handleActionClose();
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setCurrentUser(null);
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
                ]}
                loading={isUsersLoading}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[14, 16, 18, 20]}
              />
            ) : (
              <UserSectionMobile userList={itemsList} />
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
            <h2>{query?.trim().length > 2 ? searching : "Loading..."}</h2>
          </div>
        ) : (
          ""
        )}
      </div>
    </Fragment>
  );
}
