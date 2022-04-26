import { Box, Grid } from "@mui/material";
import "@src/components/common/smart/profileTimeline/profileTimeline.scss";
import PropTypes from "prop-types";

import allTopicsIcon from "@src/assets/svgs/alltopics.svg";
import tickIcon from "@src/assets/svgs/coolicon.svg";
import createdIcon from "@src/assets/svgs/created.svg";
import followedIcon from "@src/assets/svgs/followed.svg";
import ProfileTimeLineCards from "@src/components/common/presentational/profileTimeLineCards/ProfileTimeLineCards";
import RecentActivity from "@src/components/common/presentational/recentActivity/RecentActivity";
import { api } from "@src/store/reducers/api";
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

const ProfileTimeline = () => {
  const { data: topicsList, isLoading } = api.useGetTopicsListQuery({});
  return (
    <>
      <>
        <Box component="div" className="timeline_section">
          <Grid container spacing={2}>
            {!isLoading ? (
              <Grid item xs={9}>
                {topicsList?.map((item, key) => (
                  <Grid key={key} item xs={12}>
                    <ProfileTimeLineCards
                      description={item?.description}
                      title={item?.title}
                      user={item?.user}
                      image={item?.image}
                      number_of_comments={item?.number_of_comments}
                      number_of_followers={item?.number_of_followers}
                      categories={item?.categories}
                      followers={item?.followers}
                      id={item?.id}
                      reply_email_notification={item?.reply_email_notification}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <p>Loading ...</p>
            )}
            <Grid item xs={3}>
              <div className="timelineLeft">
                <div className="allTopics">
                  <Box component="div" className="card">
                    <div className="allTopicsSelect">
                      <div className="allTopicsHeading">
                        <div className="allTopicImg">
                          <img
                            src={allTopicsIcon}
                            className="imgStylingMessage"
                          />
                        </div>
                        <div className="topicHeading">All topics</div>
                      </div>
                      <div className="tickImage">
                        <img src={tickIcon} className="imgStylingMessage" />
                      </div>
                    </div>
                    <div className="followedTopics">
                      <div className="followedImg">
                        <img src={followedIcon} className="imgStylingMessage" />
                      </div>
                      <div className="followeddHeading">Followed topics</div>
                    </div>
                    <div className="createTopics">
                      <div className="createImg">
                        <img src={createdIcon} className="imgStylingMessage" />
                      </div>
                      <div className="createTopicHading">Created topics</div>
                    </div>
                  </Box>
                </div>
              </div>
              <RecentActivity />
            </Grid>
          </Grid>
        </Box>
      </>
    </>
  );
};

export default ProfileTimeline;
