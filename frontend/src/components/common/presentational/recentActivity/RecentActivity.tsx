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

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 20;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isRightSwipe && page > 1) {
      setPage((prevState) => (prevState = --prevState));
    } else if (isLeftSwipe && page < Math.ceil(userActivityList.length / 4)) {
      setPage((prevState) => (prevState = ++prevState));
    }
  };
  const handlePagination = (event: React.ChangeEvent<HTMLInputElement>) => {
    const pageNumber: number = +event.target.value;
    setPage(pageNumber);
    paginate(userActivityList, 4, pageNumber);
  };
  return (
    <Box
      component="div"
      className="recentActivitycard"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="recentActivityTitle">
        <div className="allTopicImg">
          <img src={activityIcon} className="imgStylingMessage" />
        </div>
        <div className="topicHeading">Recent Activity</div>
      </div>
      {!isLoading
        ? paginatedArr.slice(0, 4).map((item, key) => (
            <div className="userStatus" key={key}>
              <div className="userImg">
                <img
                  className="imgStylingMessage"
                  src={`${item?.user?.image}`}
                  alt={profileIcon}
                />
              </div>
              <div className="statusDetail">
                <span className="username">{item?.user?.name}</span>
                <span style={{ wordBreak: "break-word" }}> {item?.action}</span>
                <div className="postTime" style={{ padding: "5px 0px" }}>
                  {moment(item?.created_at).startOf("s").fromNow()}
                </div>
              </div>
            </div>
          ))
        : ""}
      <div className="pagtiondot" style={{ alignItems: "center" }}>
        {userActivityList.slice(0, 3).map((item, index) => (
          <div
            onChange={handlePagination}
            key={index}
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
