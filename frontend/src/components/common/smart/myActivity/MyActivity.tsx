import { useEffect, useMemo, useState } from "react";

import { Grid } from "@mui/material";
import { Stack } from "@mui/system";
import moment from "moment";
import "swiper/css/pagination";
import "swiper/css";

import profileIcon from "@src/assets/svgs/profilepic.svg";
import ActivitySection from "@src/components/common/smart/activitySection/ActivitySection";
import CustomPagination from "@src/components/shared/layout/customPagination/CustomPagination";
import { parseLink } from "@src/helpers/paging";
import { api } from "@src/store/reducers/api";
import "@src/components/common/presentational/recentActivity/style.scss";

const MyActivity = () => {
  const [paginatedActivity, setPaginatedActivity] = useState([]);

  const [page, setPage] = useState(1);

  const { data: myActivityList = { data: [], link: "" }, isLoading } =
    api.useVfseUserMeActivityListQuery({ page });

  useEffect(() => {
    setPaginatedActivity(myActivityList?.data);
  }, [myActivityList]);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    event.preventDefault();
    setPage(value);
  };

  const totalTopicPages = useMemo(
    () => parseLink(myActivityList?.link) || 1,
    [myActivityList],
  );

  return (
    <ActivitySection isLoading={isLoading}>
      <>
        {paginatedActivity?.map((item, key) => (
          <div className="userStatus" key={key}>
            <div className="userImg">
              <img
                className="imgStylingMessage"
                src={`${item?.user?.image}`}
                alt={profileIcon}
              />
            </div>
            <Grid className="statusDetail">
              <span className="username">{item?.user?.name}</span>
              <span style={{ wordBreak: "break-word", textAlign: "left" }}>
                {" "}
                {item?.action}
              </span>
              <div className="postTime" style={{ padding: "5px 0px" }}>
                {moment(item?.created_at).startOf("s").fromNow()}
              </div>
            </Grid>
          </div>
        ))}
        {paginatedActivity?.length > 0 && (
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <CustomPagination
              page={page}
              count={totalTopicPages}
              onChange={handlePagination}
            />
          </Stack>
        )}
      </>
    </ActivitySection>
  );
};

export default MyActivity;
