import { Box, Grid } from "@mui/material";
import moment from "moment";

import activityIcon from "@src/assets/svgs/activity.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import "@src/components/common/presentational/recentActivity/style.scss";
import constantsData from "@src/localization/en.json";
import {
  useOrganizationsMeReadQuery,
  useVfseUserActivityListQuery,
} from "@src/store/reducers/generated";
import "swiper/css";
import "swiper/css/pagination";
import { useSelectedOrganization } from "@src/store/hooks";

const MyActivity = () => {
  const { data: userActivityList = [], isLoading } =
    useVfseUserActivityListQuery();
  const { recentActivity } = constantsData;

  const { data: currentUser } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });

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
          {userActivityList
            .filter((item) => item?.user?.id === currentUser?.id)
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
      ) : (
        ""
      )}
    </Box>
  );
};

export default MyActivity;
