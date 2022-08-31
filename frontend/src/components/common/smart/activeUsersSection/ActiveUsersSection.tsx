import { Fragment, useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

import UserSectionMobile from "@src/components/common/smart/activeUsersSection/userSectionMobile/UserSectionMobile";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";
import { useUsersActiveUsersListQuery, User } from "@src/store/reducers/api";

import "@src/views/user/userView.scss";
import "@src/components/common/smart/userSection/userSection.scss";

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
    field: "health_network",
    headerName: "Health Network",
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
  const [tableColumns, setTableColumns] = useState(headers);

  const [query, setQuery] = useState("");
  const [hasData, setHasData] = useState(false);
  const [browserWidth] = useWindowSize();
  const { searching } = localizedData().common;

  const { noDataDescription, noDataTitle } = localizedData().organization;

  const { data: items, isLoading: isUsersLoading } =
    useUsersActiveUsersListQuery();

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
          user?.first_name
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

  return (
    <Fragment>
      <h2>Active users</h2>
      <TopViewBtns
        path="active-users"
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
        setList={setUserList}
        handleSearchQuery={handleSearchQuery}
        searchText={query}
        setSearchText={setQuery}
        actualData={items}
        hasData={hasData}
      />

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
                  {
                    field: "user_name",
                    headerName: "NAME",
                    width: 200,
                    hide: false,
                    disableColumnMenu: true,
                    sortable: false,
                    minWidth: 100,
                    flex: 1,
                    renderCell: (cellValues) => (
                      <span
                        style={{
                          color: "#111827",
                          fontWeight: 600,
                          fontStyle: "normal",
                          fontSize: "14px",
                        }}
                      >
                        {`${cellValues.row.first_name} ${cellValues.row.last_name}`}
                      </span>
                    ),
                  },
                  {
                    field: "health_network",
                    headerName: "HEALTH NETWORK",
                    width: 200,
                    hide: false,
                    disableColumnMenu: true,
                    sortable: false,
                    minWidth: 100,
                    flex: 1,
                    renderCell: (cellValues) =>
                      cellValues.row.health_networks?.map((name, index) => (
                        <span
                          key={index}
                          style={{
                            color: "#6B7280",
                            fontWeight: "normal",
                            fontStyle: "normal",
                            fontSize: "14px",
                          }}
                        >
                          {name}
                        </span>
                      )),
                  },
                  {
                    field: "STATUS",
                    disableColumnMenu: true,
                    sortable: false,
                    width: 100,
                    minWidth: 100,
                    flex: 1,
                    renderCell: (cellValues) => (
                      <div
                        style={{
                          color: `${cellValues.row.status ? "#6B7280" : "red"}`,
                          fontWeight: "normal",
                          fontStyle: "normal",
                          fontSize: "14px",
                        }}
                      >
                        {cellValues.row.is_active ? "Active" : "Locked"}
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
