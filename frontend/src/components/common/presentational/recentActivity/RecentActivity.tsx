import { useEffect, useState } from "react";

import { Box } from "@mui/material";
import moment from "moment";

import activityIcon from "@src/assets/svgs/activity.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import "@src/components/common/presentational/recentActivity/style.scss";
import { useVfseUserActivityListQuery } from "@src/store/reducers/generated";

const RecentActivity = () => {
  const { data: userActivityList = [], isLoading } =
    useVfseUserActivityListQuery();

  const [page, setPage] = useState(1);

  const paginate = (array, pageSize, pageNumber) => {
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  };

  const paginatedUserActivityList = paginate(userActivityList, 4, page);

  useEffect(() => {
    paginate(userActivityList, 4, page);
  }, [page]);

  const handlePagination = (event) => {
    const pageNumber = event.target.value;
    setPage(pageNumber);
    paginate(userActivityList, 4, pageNumber);
  };
  return (
    <Box component="div" className="recentActivitycard">
      <div className="recentActivityTitle">
        <div className="allTopicImg">
          <img src={activityIcon} className="imgStylingMessage" />
        </div>
        <div className="topicHeading">Recent Activity</div>
      </div>
      {!isLoading
        ? paginatedUserActivityList.map((item) => (
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
                <div className="postTime">{`${moment(item?.created_at).format(
                  "MMMM d, YYYY"
                )}`}</div>
              </div>
            </div>
          ))
        : ""}
      <div className="pagtiondot" style={{ alignItems: "center" }}>
        {userActivityList
          .slice(0, Math.ceil(userActivityList?.length / 4))
          .map((item, index) => (
            <div
              onChange={handlePagination}
              key={item}
              style={{ margin: "4px" }}
            >
              <input type="radio" value={index + 1} name="gender" />
            </div>
          ))}
      </div>
    </Box>
  );
};

export default RecentActivity;
