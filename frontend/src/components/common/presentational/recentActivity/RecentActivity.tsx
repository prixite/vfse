import { Box } from "@mui/material";

import activityIcon from "@src/assets/svgs/activity.svg";
import pagtiondotIcon from "@src/assets/svgs/pagtiondot.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import "@src/components/common/presentational/recentActivity/style.scss";
import { useVfseUserActivityListQuery } from "@src/store/reducers/generated";
import moment from "moment";

const RecentActivity = () => {
  const { data: userActivityList = [], isLoading } =
    useVfseUserActivityListQuery();
  return (
    <Box component="div" className="recentActivitycard">
      <div className="recentActivityTitle">
        <div className="allTopicImg">
          <img src={activityIcon} className="imgStylingMessage" />
        </div>
        <div className="topicHeading">Recent Activity</div>
      </div>
      {!isLoading
        ? userActivityList.slice(0, 4)?.map((item) => (
            <div className="userStatus" key={item?.id}>
              <div className="userImg">
                <img
                  className="imgStylingMessage"
                  src={`${item?.user?.image}`}
                  alt={profileIcon}
                />
              </div>
              <div className="statusDetail">
                <span className="username">{item?.user?.name}</span>{" "}
                {item?.action}
                <div className="postTime">{`${moment(item?.created_at).format('MMMM d, YYYY')}`}</div>
              </div>
            </div>
          ))
        : ""}
      <div className="pagtiondot">
        {/* TODO Pagination */}
        <img src={pagtiondotIcon} className="imgStylingMessage" />
      </div>
    </Box>
  );
};

export default RecentActivity;
