import { Fragment, useState, useEffect, useMemo } from "react";

import { DataGrid } from "@mui/x-data-grid";

import UserSectionMobile from "@src/components/common/smart/activeUsersSection/userSectionMobile/UserSectionMobile";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { parseLink } from "@src/helpers/paging";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";
import { User, api } from "@src/store/reducers/api";

import "@src/views/user/userView.scss";
import "@src/components/common/smart/userSection/userSection.scss";
import BackBtn from "../../presentational/backBtn/BackBtn";

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
  const [page, setPage] = useState<number>(0);
  const [pageParam, setPageParam] = useState<number>(1);

  const queryOptions = useMemo(
    () => ({
      pageParam,
    }),
    [pageParam]
  );

  const {
    data: activeUsersData = { data: [], link: "", count: 0 },
    isLoading: isActiveUsersLoading,
  } = api.useGetActiveUserListQuery({ page: queryOptions.pageParam });

  const totalPages = useMemo(
    () => parseLink(activeUsersData?.link),
    [activeUsersData?.link]
  );

  const [tableColumns, setTableColumns] = useState(headers);
  const [query, setQuery] = useState("");
  const [hasData, setHasData] = useState(false);
  const [browserWidth] = useWindowSize();
  const { searching } = localizedData().common;
  const { noDataDescription, noDataTitle } = localizedData().organization;
  const [userList, setUserList] = useState({});
  const [itemsList, setItemsList] = useState<Array<User>>([]);

  useEffect(() => {
    if (query?.trim()?.length > 2 && userList) {
      setHasData(true);
      setItemsList(itemsList);
      handleSearchQuery(query);
    } else if (activeUsersData?.data?.length && query?.length <= 2) {
      setHasData(true);
      setItemsList(activeUsersData?.data);
    } else {
      setHasData(false);
    }
  }, [query, userList, activeUsersData?.data]);

  if (isActiveUsersLoading) {
    return <p>Loading</p>;
  }

  const handleSearchQuery = async (searchQuery: string) => {
    const itemsToBeSet = [
      ...activeUsersData.data.filter((user) => {
        return (
          user?.first_name
            ?.trim()
            .toLowerCase()
            .search(searchQuery?.trim().toLowerCase()) != -1
        );
      }),
    ];
    if (activeUsersData?.data && activeUsersData?.data.length) {
      await Promise.all([itemsToBeSet, setItemsList(itemsToBeSet)]);
    }
  };

  return (
    <Fragment>
      <BackBtn />
      <h2>Active users</h2>
      <TopViewBtns
        path="active-users"
        tableColumns={tableColumns}
        setTableColumns={setTableColumns}
        setList={setUserList}
        handleSearchQuery={handleSearchQuery}
        searchText={query}
        setSearchText={setQuery}
        actualData={activeUsersData?.data}
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
                initialState={{
                  pagination: {
                    page: 0,
                    pageSize: 10,
                  },
                }}
                loading={isActiveUsersLoading}
                page={page}
                pageSize={10}
                autoHeight
                pagination
                paginationMode="server"
                rowCount={activeUsersData.count}
                onPageChange={(newPage) => {
                  if (newPage < totalPages) {
                    setPageParam(newPage + 1);
                  }
                  setPage(newPage);
                }}
                rows={[...itemsList]}
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
              />
            ) : (
              <UserSectionMobile userList={itemsList} />
            )}
          </>
        ) : (
          <NoDataFound title={noDataTitle} description={noDataDescription} />
        )}
        {isActiveUsersLoading ? (
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
