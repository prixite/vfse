import { Box, Grid } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import activityIcon from "@src/assets/svgs/activity.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import "@src/components/common/presentational/recentActivity/style.scss";
import { api } from "@src/store/reducers/api";
import "swiper/css";
import "swiper/css/pagination";

interface props {
  topicID?: number;
}
const RecentActivity = ({ topicID }: props) => {
  const { t } = useTranslation();
  const { data: userActivityList, isLoading } =
    api.useVfseUserActivityListQuery({ topic: topicID });

  const totalPageNumber = () => {
    const totalPages = Math.ceil(userActivityList?.length / 4);
    return totalPages;
  };

  return (
    <Box component="div" className="recentActivitycard">
      <div className="recentActivityTitle">
        <div className="allTopicImg">
          <img src={activityIcon} className="imgStylingMessage" />
        </div>
        <div className="topicHeading">{t("Recent Activity")}</div>
      </div>

      {!isLoading ? (
        <Grid
          style={{ width: "100%" }}
          marginBottom={1}
          paddingBottom={1}
          height="min-content"
          item
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
            {userActivityList
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
                  {JSON.parse(JSON.stringify(userActivityList))
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
};

export default RecentActivity;
