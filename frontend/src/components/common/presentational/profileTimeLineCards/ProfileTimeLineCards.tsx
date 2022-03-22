import { Box } from "@mui/material";

import "@src/components/common/presentational/profileTimeLineCards/profileTimelineCards.scss";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
interface ProfileTimelineCards {
  cardText: string;
  cardTextTitle: string;
  messageText: string;
  followerText: string;
  followerImage: string;
  messageImage: string;
  followerProfiles: string;
  profileImage: string;
  userName: string;
  postTime: string;
  ultraImage: string;
  sampleImage: string;
}

const ProfileTimelineCards = ({
  cardText,
  cardTextTitle,
  messageText,
  followerText,
  followerImage,
  messageImage,
  followerProfiles,
  profileImage,
  userName,
  postTime,
  ultraImage,
  sampleImage,
}: ProfileTimelineCards) => {
  const [browserWidth] = useWindowSize();
  return (
    <>
      {browserWidth > mobileWidth ? (
        <div className="timelineInfo">
          <div className="timelineCards">
            <Box component="div" className="card">
              <div className="card_header">
                <div className="userInfoWrapper">
                  <div className="topic_updates_imags">
                    <img src={profileImage} className="imgStyling" />
                  </div>
                  <div className="user_info">
                    <div className="userName">{userName}</div>
                    <div className="postTime">{postTime}</div>
                  </div>
                </div>
                <div className="topic_updates_imags">
                  <img src={followerImage} className="imgStyling" />
                </div>
              </div>
              <div className="userUltraStatus">
                <div>
                  <img src={ultraImage} className="imgStyling" />
                </div>
                <div className="ultraSec">
                  <img src={ultraImage} className="imgStyling" />
                </div>
                <div className="ultraThr">
                  <img src={ultraImage} className="imgStyling" />
                </div>
              </div>
              <div className="card_title">{cardTextTitle}</div>
              <div className="card_detail">{cardText}</div>
              <div className="card_image">
                <div>
                  <img src={sampleImage} className="postImage" />
                </div>
              </div>
              <div className="card_footer">
                <div className="profile_side">
                  <div className="follower_img_container">
                    <img
                      src={followerProfiles}
                      className="imgStylingProfiles"
                    />
                  </div>
                  <div className="followerText">{followerText}</div>
                </div>
                <div className="message_side">
                  <div className="message_text_container">
                    <img src={messageImage} className="imgStylingMessage" />
                  </div>
                  <div className="messageText">{messageText}</div>
                </div>
              </div>
            </Box>
          </div>
        </div>
      ) : (
        <div className="mobiletimelineInfo">
          <div className="timelineCards">
            <Box component="div" className="card">
              <div className="card_header">
                <div className="userInfoWrapper">
                  <div className="topic_updates_imags">
                    <img src={profileImage} className="imgStyling" />
                  </div>
                  <div className="user_info">
                    <div className="userName">{userName}</div>
                    <div className="postTime">{postTime}</div>
                  </div>
                </div>
                <div className="topic_updates_imags">
                  <img src={followerImage} className="imgStyling" />
                </div>
              </div>
              <div className="userUltraStatus">
                <div className="ultraFst">
                  <img src={ultraImage} className="imgStylingone" />
                </div>
                <div className="ultraSec">
                  <img src={ultraImage} className="imgStylingtwo" />
                </div>
              </div>
              <div className="card_title">{cardTextTitle}</div>
              <div className="card_detail">{cardText}</div>
              <div className="card_image">
                <div>
                  <img src={sampleImage} className="postImage" />
                </div>
              </div>
              <div className="card_footer">
                <div className="profile_side">
                  <div className="follower_img_container">
                    <img
                      src={followerProfiles}
                      className="imgStylingProfiles"
                    />
                  </div>
                  <div className="followerText">{followerText}</div>
                </div>
                <div className="message_side">
                  <div className="message_text_container">
                    <img src={messageImage} className="imgStylingMessage" />
                  </div>
                  <div className="messageText">{messageText}</div>
                </div>
              </div>
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileTimelineCards;
