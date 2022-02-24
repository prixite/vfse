import { Box } from "@mui/material";

import "@src/components/common/Smart/LastActiveUser/LastActiveUser.scss";
import unionIcon from "@src/assets/svgs/Union.svg";
import LastActiveUserCells from "@src/components/common/Presentational/LastActiveUserCell/LastActiveUserCell";
import LastActiveMobile from "@src/components/common/Smart/LastActiveUser/LastActiveMobile";
import useWindowSize from "@src/components/shared/CustomHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";
const { lastActiveUser, seeAll } = localizedData().Faq;

interface LastActiveMobileCards {
  user_name: string;
  unionImage: string;
  health_network: string;
  status: string;
}

const last_active_info: LastActiveMobileCards[] = [
  {
    user_name: "Abdullah Jane",
    health_network: "Advent Health",
    status: "Active",
    unionImage: unionIcon,
  },
  {
    user_name: "Ali Coady",
    health_network: "Advent Health",
    status: "Locked",
    unionImage: unionIcon,
  },
  {
    user_name: "Asad Coady",
    health_network: "Advent Health",
    status: "Active",
    unionImage: unionIcon,
  },
  {
    user_name: "Fared Jane",
    health_network: "Advent Health",
    status: "Locked",
    unionImage: unionIcon,
  },
  {
    user_name: "Isra Jane",
    health_network: "Advent Health",
    status: "Active",
    unionImage: unionIcon,
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
            <LastActiveUserCells />
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
