import { Box } from "@mui/material";

import activityIcon from "@src/assets/svgs/activity.svg";
import pagtiondotIcon from "@src/assets/svgs/pagtiondot.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import useRecentActivityList from "@src/miragejs/mockApiHooks/useRecentActivityList";
import "@src/components/common/presentational/recentActivity/style.scss";
const RecentActivity = () => {
  const [activityData, isLoading] = useRecentActivityList();
  return (
    <Box component="div" className="recentActivitycard">
      <div className="recentActivityTitle">
        <div className="allTopicImg">
          <img src={activityIcon} className="imgStylingMessage" />
        </div>
        <div className="topicHeading">Recent Activity</div>
      </div>
      {!isLoading
        ? activityData.map((detail) => (
            <div className="userStatus" key={detail?.id}>
              <div className="userImg">
                <img src={profileIcon} className="imgStylingMessage" />
              </div>
              <div className="statusDetail">
                <span className="username">{detail?.name}</span>{" "}
                {detail?.activity}
                <div className="postTime">{detail?.time}</div>
              </div>
            </div>
          ))
        : ""}
      <div className="pagtiondot">
        <img src={pagtiondotIcon} className="imgStylingMessage" />
      </div>
    </Box>
  );
};

export default RecentActivity;
