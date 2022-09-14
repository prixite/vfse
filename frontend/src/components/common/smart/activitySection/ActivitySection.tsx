import React from "react";

import { Box, Grid } from "@mui/material";

import activityIcon from "@src/assets/svgs/activity.svg";
import "@src/components/common/smart/activitySection/style.scss";
import constantsData from "@src/localization/en.json";

const ActivitySection: React.FC<{
  children: React.ReactNode;
  isLoading: boolean;
}> = ({ children, isLoading }) => {
  const { recentActivity } = constantsData;

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
          {children}
        </Grid>
      ) : (
        ""
      )}
    </Box>
  );
};

export default ActivitySection;
