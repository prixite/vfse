import { Box } from "@mui/material";

import "@src/components/common/Smart/LastActiveUser/LastActiveUser.scss";
import LastActiveUserCells from "@src/components/common/Presentational/LastActiveUserCell/LastActiveUserCell";

const LastActiveUser = () => {
  return (
    <Box component="div" className="last_active_users">
      <div className="heading_section">
        <h2 className="heading">Last active users</h2>
        <h3 className="subheading">See All</h3>
      </div>
      <div className="last_active_user_table">
        <LastActiveUserCells />
      </div>
    </Box>
  );
};

export default LastActiveUser;
