import React, { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ProfileTimeLineCards from "@src/components/common/presentational/profileTimeLineCards/ProfileTimeLineCards";
import RecentActivity from "@src/components/common/presentational/recentActivity/RecentActivity";
import TopicToggler from "@src/components/common/presentational/topicToggler/TopicToggler";
import useStyles from "@src/components/common/smart/profileTimeline/Styles";
import CustomPagination from "@src/components/shared/layout/customPagination/CustomPagination";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { VfseTopicsListApiResponse } from "@src/store/reducers/api";
import { getTopicListArg } from "@src/types/interfaces";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

type Props = {
  paginatedTopics?: VfseTopicsListApiResponse;
  setTopicListPayload?: React.Dispatch<React.SetStateAction<getTopicListArg>>;
  topicListPayload: getTopicListArg;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  count: number;
  onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
};
const ProfileTimeline = ({
  paginatedTopics,
  setTopicListPayload,
  topicListPayload,
  setPage,
  page,
  count,
  onChange,
}: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const [showNoDataFound, setShowNoDataFound] = useState<boolean>(false);

  useEffect(() => {
    paginatedTopics.length === 0 &&
      setTimeout(() => {
        setShowNoDataFound(true);
      }, 1000);

    return () => {
      setShowNoDataFound(false);
    };
  }, []);

  return (
    <>
      <Box component="div" className={classes.timelineSection}>
        <Grid container spacing={2} className={classes.mainProfileGrid}>
          {/* ProfileTimeLine */}
          {paginatedTopics ? (
            <Grid item xs={9} className={classes.profileTimeLine}>
              {paginatedTopics?.length > 0 ? (
                <Grid
                  container
                  xs={12}
                  item
                  style={{
                    marginTop: "0px",
                    justifyContent: "center",
                  }}
                >
                  {paginatedTopics?.map((item, key) => (
                    <Grid key={key} item xs={12}>
                      <ProfileTimeLineCards
                        id={item?.id}
                        description={item?.description}
                        title={item?.title}
                        user={item?.user}
                        image={item?.image}
                        number_of_comments={item?.number_of_comments}
                        number_of_followers={item?.number_of_followers}
                        categories={item?.categories}
                        followers={item?.followers}
                        reply_email_notification={
                          item?.reply_email_notification
                        }
                        createdAt={item?.created_at}
                      />
                    </Grid>
                  ))}
                  {paginatedTopics?.length > 0 && (
                    <CustomPagination
                      page={page}
                      count={count}
                      onChange={onChange}
                    />
                  )}
                </Grid>
              ) : (
                <>
                  {showNoDataFound && (
                    <NoDataFound
                      search
                      title={"No Data Found"}
                      description={"No data found for popular topics"}
                    />
                  )}
                </>
              )}
            </Grid>
          ) : (
            <p>{t("Loading ...")}</p>
          )}
          {/* RecentActivity */}
          <Grid item xs={3} className={classes.recentActivity}>
            <div className={classes.timelineLeft}>
              <div>
                <TopicToggler
                  setPage={setPage}
                  topicListPayload={topicListPayload}
                  setTopicListPayload={setTopicListPayload}
                />
              </div>
            </div>
            <RecentActivity />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileTimeline;
