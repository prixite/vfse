import { Box, Grid } from "@mui/material";

import "@src/components/common/Smart/ProfileTimeline/ProfileTimeline.scss";
import activityIcon from "@src/assets/svgs/activity.svg";
import allTopicsIcon from "@src/assets/svgs/alltopics.svg";
import badgeIcon from "@src/assets/svgs/Badge.svg";
import buttonsIcon from "@src/assets/svgs/Buttons.svg";
import tickIcon from "@src/assets/svgs/coolicon.svg";
import createdIcon from "@src/assets/svgs/created.svg";
import followedIcon from "@src/assets/svgs/followed.svg";
import followersIcon from "@src/assets/svgs/followers.svg";
import messageIcon from "@src/assets/svgs/message.svg";
import pagtiondotIcon from "@src/assets/svgs/pagtiondot.svg";
import profileIcon from "@src/assets/svgs/profilepic.svg";
import sampleIcon from "@src/assets/svgs/sampleimg.svg";
import ProfileTimeLineCards from "@src/components/common/Presentational/ProfileTimeLineCards/ProfileTimeLineCards";

const timeline_info = [
  {
    card_text:
      "I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a lifestyle in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and...",
    card_text_title: "Clinical Specialist for MedTronics",
    followers_text: "24 followers",
    message_text: "142",
    ultra_image: badgeIcon,
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
    profile_icon: profileIcon,
    user_name: "Alex Jacobs",
    post_time: "3 hours ago",
    sample_icon: sampleIcon,
  },
  {
    card_text:
      "I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a lifestyle in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and...",
    card_text_title: "Clinical Specialist for MedTronics",
    followers_text: "24 followers",
    message_text: "142",
    device_number: "2,220",
    ultra_image: badgeIcon,
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
    profile_icon: profileIcon,
    user_name: "Alex Jacobs",
    post_time: "3 hours ago",
    sample_icon: sampleIcon,
  },
  {
    card_text:
      "I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a lifestyle in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and...",
    card_text_title: "Clinical Specialist for MedTronics",
    followers_text: "24 followers",
    message_text: "142",
    ultra_image: badgeIcon,
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
    profile_icon: profileIcon,
    user_name: "Alex Jacobs",
    post_time: "3 hours ago",
    sample_icon: sampleIcon,
  },
  {
    card_text:
      "I am currently applying for a Clinical Specialist position with Medtronic and am curious if there are any current Clinical Specialists that could tell me a little bit more about their role? The recruiter I spoke with said that the job is more of a lifestyle in that you are essentially on call to go to clinics between 7 a.m. and 6 p.m. and...",
    card_text_title: "Clinical Specialist for MedTronics",
    followers_text: "24 followers",
    message_text: "142",
    ultra_image: badgeIcon,
    follower_btn: buttonsIcon,
    message_icon: messageIcon,
    followers_icon: followersIcon,
    profile_icon: profileIcon,
    user_name: "Alex Jacobs",
    post_time: "3 hours ago",
    sample_icon: sampleIcon,
  },
];

const ProfileTimeline = () => {
  return (
    <>
      <Box component="div" className="timeline_section">
        <Grid container spacing={2}>
          <Grid item xs={9}>
            {timeline_info.map((item, key) => (
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
              <div className="recentActivity">
                <Box component="div" className="card">
                  <div className="recentActivityTitle">
                    <div className="allTopicImg">
                      <img src={activityIcon} className="imgStylingMessage" />
                    </div>
                    <div className="topicHeading">Recent Activity</div>
                  </div>
                  <div className="userStatus">
                    <div className="userImg">
                      <img src={profileIcon} className="imgStylingMessage" />
                    </div>
                    <div className="statusDetail">
                      <span className="username">David Karger</span> started
                      following your topic.
                      <div className="postTime">3 hours ago</div>
                    </div>
                  </div>
                  <div className="userStatus">
                    <div className="userImg">
                      <img src={profileIcon} className="imgStylingMessage" />
                    </div>
                    <div className="statusDetail">
                      <span className="username">David Karger</span> a comment
                      to topic you follow.
                      <div className="postTime">3 hours ago</div>
                    </div>
                  </div>
                  <div className="userStatus">
                    <div className="userImg">
                      <img src={profileIcon} className="imgStylingMessage" />
                    </div>
                    <div className="statusDetail">
                      <span className="username">David Karger</span> a comment
                      to topic you follow.
                      <div className="postTime">3 hours ago</div>
                    </div>
                  </div>
                  <div className="userStatus">
                    <div className="userImg">
                      <img src={profileIcon} className="imgStylingMessage" />
                    </div>
                    <div className="statusDetail">
                      <span className="username">David Karger</span> a comment
                      to topic you follow.
                      <div className="postTime">3 hours ago</div>
                    </div>
                  </div>
                  <div className="userStatus">
                    <div className="userImg">
                      <img src={profileIcon} className="imgStylingMessage" />
                    </div>
                    <div className="statusDetail">
                      <span className="username">David Karger</span> a comment
                      to topic you follow.
                      <div className="postTime">3 hours ago</div>
                    </div>
                  </div>
                  <div className="pagtiondot">
                    <img src={pagtiondotIcon} className="imgStylingMessage" />
                  </div>
                </Box>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ProfileTimeline;
