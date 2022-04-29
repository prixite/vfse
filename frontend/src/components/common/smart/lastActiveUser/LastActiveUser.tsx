import "@src/components/common/smart/lastActiveUser/lastActiveUser.scss";

import { Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import LastActiveMobile from "@src/components/common/smart/lastActiveUser/lastActiveMobile/LastActiveMobile";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";
import { useUsersActiveUsersListQuery } from "@src/store/reducers/generated";

const { lastActiveUser, seeAll } = localizedData().Faq;

const LastActiveUser = () => {
  const [browserWidth] = useWindowSize();
  const { data, isLoading } = useUsersActiveUsersListQuery();
  return (
    <>
      {browserWidth > mobileWidth ? (
        <>
          {data && data?.length && !isLoading ? (
            <Box component="div" className="last_active_users">
              <div className="heading_section">
                <h2 className="heading">{lastActiveUser}</h2>
                <h3 className="subheading">{seeAll}</h3>
              </div>
              <div className="last_active_user_table">
                {/* <LastActiveUserCells /> */}
                <DataGrid
                  rows={data}
                  rowHeight={58}
                  headerHeight={49}
                  hideFooter
                  columns={[
                    {
                      field: "user_name",
                      headerName: "NAME",
                      width: 200,
                      hide: false,
                      disableColumnMenu: true,
                      sortable: false,
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
                      renderCell: (cellValues) => (
                        <div
                          style={{
                            color: `${
                              cellValues.row.status ? "#6B7280" : "red"
                            }`,
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
              </div>
            </Box>
          ) : (
            <p> Loading ...</p>
          )}
        </>
      ) : (
        <Box component="div" className="last_active_users_mobile">
          <div className="heading_section">
            <h2 className="heading">{lastActiveUser}</h2>
            <h3 className="subheading">{seeAll}</h3>
          </div>
          <div className="last_active_user_table_mobile">
            <LastActiveMobile lastActiveDoc={data} />
          </div>
        </Box>
      )}
    </>
  );
};

export default LastActiveUser;
