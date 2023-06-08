import { Fragment, useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";
import { useTranslation } from "react-i18next";

import UserSectionMobile from "@src/components/common/smart/activeUsersSection/userSectionMobile/UserSectionMobile";
import TopViewBtns from "@src/components/common/smart/topViewBtns/TopViewBtns";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { mobileWidth } from "@src/helpers/utils/config";
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
  const { t } = useTranslation();
  const [page, setPage] = useState<number>(0);

  const {
    data: activeUsersData = { data: [], link: "", count: 0 },
    isLoading: isActiveUsersLoading,
  } = api.useGetActiveUserListQuery({ page: page + 1 });

  const [tableColumns, setTableColumns] = useState(headers);
  const [query, setQuery] = useState("");
  const [hasData, setHasData] = useState(false);
  const [browserWidth] = useWindowSize();
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
                rowCount={activeUsersData?.count}
                onPageChange={(_page) => {
                  setPage(_page);
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
          <NoDataFound
            title={t("Sorry! No results found. :(")}
            description={t("Try Again")}
          />
        )}
        {isActiveUsersLoading ? (
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
    </Fragment>
  );
}
