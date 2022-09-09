import { useEffect, useMemo, useState } from "react";

import { Box, Grid, Pagination } from "@mui/material";
import { Stack } from "@mui/system";
import moment from "moment";
import "swiper/css/pagination";
import "swiper/css";

import activityIcon from "@src/assets/svgs/activity.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import { parseLink } from "@src/helpers/paging";
import constantsData from "@src/localization/en.json";
import { api } from "@src/store/reducers/api";
import "@src/components/common/presentational/recentActivity/style.scss";

const MyActivity = () => {
  const [paginatedActivity, setPaginatedActivity] = useState([]);

  const [page, setPage] = useState(1);

  const { data: myActivityList = { data: [], link: "" }, isLoading } =
    api.useVfseUserMeActivityListQuery({ page });
  const { recentActivity } = constantsData;

  useEffect(() => {
    setPaginatedActivity(myActivityList?.data);
  }, [myActivityList]);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setPage(value);
  };

  const totalTopicPages = useMemo(
    () => parseLink(myActivityList?.link) || 1,
    [myActivityList]
  );

  return (
    <Box component="div" className="recentActivitycard">
      <div className="recentActivityTitle">
        <div className="allTopicImg">
          <img src={activityIcon} className="imgStylingMessage" />
        </div>
        <div className="topicHeading">{recentActivity.title}</div>
      </div>

      {!isLoading ? (
        <>
          <Grid
            style={{ width: "100%" }}
            marginBottom={1}
            paddingBottom={1}
            height="min-content"
            xs={12}
            sm={12}
            md={12}
            lg={12}
          >
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
          </Grid>
          {paginatedActivity?.length > 0 && (
            <Stack
              spacing={2}
              direction="row"
              alignItems="center"
              justifyContent="center"
            >
              <Pagination
                defaultPage={1}
                page={page}
                count={totalTopicPages}
                onChange={handlePagination}
                size="large"
              />
            </Stack>
          )}
        </>
      ) : (
        ""
      )}
    </Box>
  );
};

export default MyActivity;
