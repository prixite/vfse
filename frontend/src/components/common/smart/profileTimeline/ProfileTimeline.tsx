import { useState } from "react";

import { Box, Grid } from "@mui/material";
import "@src/components/common/smart/profileTimeline/profileTimeline.scss";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";

import activityIcon from "@src/assets/svgs/activity.svg";
import allTopicsIcon from "@src/assets/svgs/alltopics.svg";
import tickIcon from "@src/assets/svgs/coolicon.svg";
import createdIcon from "@src/assets/svgs/created.svg";
import followedIcon from "@src/assets/svgs/followed.svg";
import pagtiondotIcon from "@src/assets/svgs/pagtiondot.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import ProfileTimeLineCards from "@src/components/common/presentational/profileTimeLineCards/ProfileTimeLineCards";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
import { topicsTabs } from "@src/helpers/utils/constants";
import userTimeLine from "@src/miragejs/mockApiHooks/userTimeLine";

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
  const [data, isLoading] = userTimeLine();
  const [browserWidth] = useWindowSize();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      {browserWidth > mobileWidth ? (
        <>
          {!isLoading ? (
            <Box component="div" className="timeline_section">
              <Grid container spacing={2}>
                <Grid item xs={9}>
                  {data.map((item, key) => (
                    <Grid key={key} item xs={12}>
                      <ProfileTimeLineCards
                        key={item.message_text}
                        cardText={item.card_text}
                        cardTextTitle={item.card_text_title}
                        messageText={item.message_text}
                        followerText={item.followers_text}
                        ultraImage={item.ultra_image}
                        followerImage={item.follower_btn}
                        messageImage={item.message_icon}
                        followerProfiles={item.followers_icon}
                        profileImage={item.profile_icon}
                        userName={item.user_name}
                        postTime={item.post_time}
                        sampleImage={item.sample_icon}
                      />
                    </Grid>
                  ))}
                </Grid>
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
                            <img
                              src={followedIcon}
                              className="imgStylingMessage"
                            />
                          </div>
                          <div className="followeddHeading">
                            Followed topics
                          </div>
                        </div>
                        <div className="createTopics">
                          <div className="createImg">
                            <img
                              src={createdIcon}
                              className="imgStylingMessage"
                            />
                          </div>
                          <div className="createTopicHading">
                            Created topics
                          </div>
                        </div>
                      </Box>
                    </div>
                    <div className="recentActivity">
                      <Box component="div" className="card">
                        <div className="recentActivityTitle">
                          <div className="allTopicImg">
                            <img
                              src={activityIcon}
                              className="imgStylingMessage"
                            />
                          </div>
                          <div className="topicHeading">Recent Activity</div>
                        </div>
                        <div className="userStatus">
                          <div className="userImg">
                            <img
                              src={profileIcon}
                              className="imgStylingMessage"
                            />
                          </div>
                          <div className="statusDetail">
                            <span className="username">David Karger</span>{" "}
                            started following your topic.
                            <div className="postTime">3 hours ago</div>
                          </div>
                        </div>
                        <div className="userStatus">
                          <div className="userImg">
                            <img
                              src={profileIcon}
                              className="imgStylingMessage"
                            />
                          </div>
                          <div className="statusDetail">
                            <span className="username">David Karger</span> a
                            comment to topic you follow.
                            <div className="postTime">3 hours ago</div>
                          </div>
                        </div>
                        <div className="userStatus">
                          <div className="userImg">
                            <img
                              src={profileIcon}
                              className="imgStylingMessage"
                            />
                          </div>
                          <div className="statusDetail">
                            <span className="username">David Karger</span> a
                            comment to topic you follow.
                            <div className="postTime">3 hours ago</div>
                          </div>
                        </div>
                        <div className="userStatus">
                          <div className="userImg">
                            <img
                              src={profileIcon}
                              className="imgStylingMessage"
                            />
                          </div>
                          <div className="statusDetail">
                            <span className="username">David Karger</span> a
                            comment to topic you follow.
                            <div className="postTime">3 hours ago</div>
                          </div>
                        </div>
                        <div className="userStatus">
                          <div className="userImg">
                            <img
                              src={profileIcon}
                              className="imgStylingMessage"
                            />
                          </div>
                          <div className="statusDetail">
                            <span className="username">David Karger</span> a
                            comment to topic you follow.
                            <div className="postTime">3 hours ago</div>
                          </div>
                        </div>
                        <div className="pagtiondot">
                          <img
                            src={pagtiondotIcon}
                            className="imgStylingMessage"
                          />
                        </div>
                      </Box>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <p>Loading ...</p>
          )}
        </>
      ) : (
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{ borderBottom: 1, borderColor: "divider", marginTop: "24px" }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              {topicsTabs.map((tab: string, index: number) => {
                return (
                  <Tab
                    key={index}
                    label={tab}
                    sx={{
                      "&.Mui-selected": {
                        color: "#0000FF",
                      },
                    }}
                    className="tab-style"
                  />
                );
              })}
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            {!isLoading ? (
              <Box component="div" className="timeline_section">
                <Grid item xs={12}>
                  {data.map((item, key) => (
                    <Grid key={key} item xs={12}>
                      <ProfileTimeLineCards
                        key={item.message_text}
                        cardText={item.card_text}
                        cardTextTitle={item.card_text_title}
                        messageText={item.message_text}
                        followerText={item.followers_text}
                        ultraImage={item.ultra_image}
                        followerImage={item.follower_btn}
                        messageImage={item.message_icon}
                        followerProfiles={item.followers_icon}
                        profileImage={item.profile_icon}
                        userName={item.user_name}
                        postTime={item.post_time}
                        sampleImage={item.sample_icon}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <p>Loading ...</p>
            )}
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
        </Box>
      )}
    </>
  );
};

export default ProfileTimeline;
