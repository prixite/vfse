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

  const [page, setPage] = useState<number>(1);
  const [paginatedArr, setPaginatedArr] = useState([]);

  const paginate = (array, pageSize = 4, pageNumber = 1) => {
    const tempArr = JSON.parse(JSON.stringify(array))
      .reverse()
      .slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    setPaginatedArr(tempArr);
  };

  useEffect(() => {
    paginate(userActivityList, 4, page);
  }, [page, userActivityList]);

  const handlePagination = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pageNumber: number = +event.target.value;
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
        ? paginatedArr.slice(0, 4).map((item) => (
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
                <div className="postTime">
                  {moment(item?.created_at).startOf("minutes").fromNow()}
                </div>
              </div>
            </div>
          ))
        : ""}
      <div className="pagtiondot" style={{ alignItems: "center" }}>
        {userActivityList.slice(0, 3).map((item, index) => (
          <div onChange={handlePagination} key={item} style={{ margin: "4px" }}>
            <input type="radio" value={index + 1} name="gender" />
          </div>
        ))}
      </div>
    </Box>
  );
};

export default RecentActivity;
