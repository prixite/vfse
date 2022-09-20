import { useCallback } from "react";

import { Box, Grid } from "@mui/material";
import moment from "moment";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import activityIcon from "@src/assets/svgs/activity.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import "@src/components/common/presentational/recentActivity/style.scss";
import constantsData from "@src/localization/en.json";
import { useSelectedOrganization } from "@src/store/hooks";
import {
  api,
  TopicDetail,
  useOrganizationsMeReadQuery,
} from "@src/store/reducers/api";

import "swiper/css";
import "swiper/css/pagination";

interface RecentActivityProps {
  topicData?: TopicDetail;
}
export default function RecentActivity({ topicData }: RecentActivityProps) {
  const { data: userActivityList, isLoading } =
    api.useVfseUserActivityListQuery();
  const { recentActivity } = constantsData;

  const totalPageNumber = () => {
    const totalPages = Math.ceil(
      checkRelatedActivity(userActivityList)?.length / 4
    );
    return totalPages;
  };

  const selectedOrganization = useSelectedOrganization();
  const { data: me } = useOrganizationsMeReadQuery(
    {
      id: selectedOrganization?.id.toString(),
    },
    {
      skip: !selectedOrganization,
    }
  );

  const sortByTime = useCallback(
    (array) => {
      if (userActivityList) {
        let tempArr = [...array];
        tempArr = tempArr.sort(function (left, right) {
          return moment(left?.created_at)
            .startOf("s")
            .diff(moment(right?.created_at).startOf("s"));
        });
        return tempArr;
      }
    },
    [userActivityList]
  );

  const checkRelatedActivity = useCallback(
    (array) => {
      if (!Object.keys(topicData).length) {
        const tempArr = sortByTime(userActivityList);
        return tempArr;
      } else {
        if (array) {
          let tempArr = [...array];
          tempArr = tempArr?.filter((item) =>
            topicData?.topicData?.followers?.some(
              (item2) =>
                item2?.name === item?.user?.name ||
                item?.user?.name === `${me?.first_name} ${me?.last_name}`
            )
          );
          tempArr = sortByTime(tempArr);
          return tempArr;
        }
      }
    },
    [topicData, userActivityList, me]
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
          <Swiper
            pagination={{
              dynamicBullets: true,
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {checkRelatedActivity(userActivityList)
              ?.slice(0, totalPageNumber())
              .map((item, index) => (
                <SwiperSlide
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    width: "200px",
                  }}
                  key={index}
                >
                  {checkRelatedActivity(userActivityList)
                    ?.reverse()
                    ?.slice((index + 1 - 1) * 4, (index + 1) * 4)
                    .map((item, key) => (
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
                          <span
                            style={{
                              wordBreak: "break-word",
                              textAlign: "left",
                            }}
                          >
                            {" "}
                            {item?.action}
                          </span>
                          <div
                            className="postTime"
                            style={{ padding: "5px 0px" }}
                          >
                            {moment(item?.created_at).startOf("s").fromNow()}
                          </div>
                        </Grid>
                      </div>
                    ))}
                </SwiperSlide>
              ))}
          </Swiper>
        </Grid>
      ) : (
        ""
      )}
    </Box>
  );
}
