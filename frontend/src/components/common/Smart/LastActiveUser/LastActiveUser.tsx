import { Box } from "@mui/material";
import "@src/components/common/Smart/LastActiveUser/LastActiveUser.scss";
import { DataGrid } from "@mui/x-data-grid";

import unionIcon from "@src/assets/svgs/Union.svg";
import LastActiveMobile from "@src/components/common/Smart/LastActiveUser/LastActiveMobile";
import useWindowSize from "@src/components/shared/CustomHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";

const { lastActiveUser, seeAll } = localizedData().Faq;

interface LastActiveMobileCards {
  id: number;
  user_name: string;
  health_network: string;
  status: boolean;
  unionImage: string;
}

const last_active_info: LastActiveMobileCards[] = [
  {
    id: 1,
    user_name: "Abdullah Jane",
    health_network: "Advent Health",
    unionImage: unionIcon,
    status: false,
  },
  {
    id: 2,
    user_name: "Ali Coady",
    health_network: "Advent Health",
    unionImage: unionIcon,
    status: true,
  },
  {
    id: 3,
    user_name: "Asad Coady",
    health_network: "Advent Health",
    unionImage: unionIcon,
    status: false,
  },
  {
    id: 4,
    user_name: "Fared Jane",
    health_network: "Advent Health",
    unionImage: unionIcon,
    status: true,
  },
  {
    id: 5,
    user_name: "Isra Jane",
    health_network: "Advent Health",
    unionImage: unionIcon,
    status: false,
  },
  {
    id: 6,
    user_name: "Asad Coady",
    health_network: "Advent Health",
    unionImage: unionIcon,
    status: false,
  },
  {
    id: 7,
    user_name: "Fared Jane",
    health_network: "Advent Health",
    unionImage: unionIcon,
    status: true,
  },
];
const LastActiveUser = () => {
  const [browserWidth] = useWindowSize();

  return (
    <>
      {browserWidth > mobileWidth ? (
        <Box component="div" className="last_active_users">
          <div className="heading_section">
            <h2 className="heading">{lastActiveUser}</h2>
            <h3 className="subheading">{seeAll}</h3>
          </div>
          <div className="last_active_user_table">
            {/* <LastActiveUserCells /> */}
            <DataGrid
              rows={last_active_info}
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
                      {cellValues.row.user_name}
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
                  renderCell: (cellValues) => (
                    <span
                      style={{
                        color: "#6B7280",
                        fontWeight: "normal",
                        fontStyle: "normal",
                        fontSize: "14px",
                      }}
                    >
                      {cellValues.row.user_name}
                    </span>
                  ),
                },
                {
                  field: "STATUS",
                  disableColumnMenu: true,
                  sortable: false,
                  width: 100,
                  renderCell: (cellValues) => (
                    <span
                      style={{
                        color: `${cellValues.row.status ? "#6B7280" : "red"}`,
                        fontWeight: "normal",
                        fontStyle: "normal",
                        fontSize: "14px",
                      }}
                    >
                      {cellValues.row.status ? "Active" : "Locked"}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </Box>
      ) : (
        <Box component="div" className="last_active_users_mobile">
          <div className="heading_section">
            <h2 className="heading">{lastActiveUser}</h2>
            <h3 className="subheading">{seeAll}</h3>
          </div>
          <div className="last_active_user_table_mobile">
            <LastActiveMobile lastActiveDoc={last_active_info} />
          </div>
        </Box>
      )}
    </>
  );
};

export default LastActiveUser;
