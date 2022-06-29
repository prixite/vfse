import { useEffect, useState } from "react";

import { Box, Grid } from "@mui/material";
import PropTypes from "prop-types";

import ProfileTimeLineCards from "@src/components/common/presentational/profileTimeLineCards/ProfileTimeLineCards";
import RecentActivity from "@src/components/common/presentational/recentActivity/RecentActivity";
import TopicToggler from "@src/components/common/presentational/topicToggler/TopicToggler";
import useStyles from "@src/components/common/smart/profileTimeline/Styles";
import { api, VfseTopicsListApiResponse } from "@src/store/reducers/api";
import { getTopicListArg } from "@src/types/interfaces";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";

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
  setPaginatedTopics?: React.Dispatch<
    React.SetStateAction<VfseTopicsListApiResponse>
  >;
};
const ProfileTimeline = ({ paginatedTopics, setPaginatedTopics }: Props) => {
  const classes = useStyles();
  const [topicListPayload, setTopicListPayload] = useState<getTopicListArg>({});
  const { data: topicsList = [], isLoading } =
    api.useGetTopicsListQuery(topicListPayload);

  useEffect(() => {
    if (topicsList && topicsList.length) {
      setPaginatedTopics([...topicsList.slice(0, topicsList.length)]);
    }
  }, [topicsList]);
  return (
    <>
      <Box component="div" className={classes.timelineSection}>
        <Grid container spacing={2} className={classes.mainProfileGrid}>
          {/* ProfileTimeLine */}
          {!isLoading ? (
            <Grid item xs={9} className={classes.profileTimeLine}>
              {paginatedTopics?.length > 0 ? (
                <Grid container xs={12} item style={{ marginTop: "0px" }}>
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
                </Grid>
              ) : (
                <NoDataFound
                  search
                  title={"No Data Found"}
                  description={"No data found for popular topics"}
                />
              )}
            </Grid>
          ) : (
            <p>Loading ...</p>
          )}
          {/* RecentActivity */}
          <Grid item xs={3} className={classes.recentActivity}>
            <div className={classes.timelineLeft}>
              <div>
                <TopicToggler setTopicListPayload={setTopicListPayload} />
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
