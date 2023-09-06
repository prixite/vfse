import { Box } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";

import messageIcon from "@src/assets/svgs/message.svg";
import "@src/components/common/presentational/topicCard/topicCard.scss";
import useWindowSize from "@src/components/shared/customHooks/useWindowSize";
import { mobileWidth } from "@src/helpers/utils/config";
// import { TopicDetail } from "@src/store/reducers/generated";
import { TopicDetail } from "@src/store/reducers/generatedWrapper";

interface TopicCardProps {
  topic: TopicDetail;
}
const TopicCard = ({ topic }: TopicCardProps) => {
  const { t } = useTranslation();
  const [browserWidth] = useWindowSize();
  return (
    <Box component="div" className="topicCard">
      <>
        <div className="timelineInfo">
          <div className="timelineCards">
            <Box
              component="div"
              className="card"
              style={
                browserWidth < mobileWidth
                  ? {
                      padding: "16px",
                      backgroundColor: "white",
                      boxShadow: "3px 3px 12px rgb(10 35 83 / 8%)",
                    }
                  : {}
              }
            >
              <div className="card_header">
                <div className="userInfoWrapper">
                  <div className="topic_updates_imags">
                    <div className="imgStyling">
                      <img
                        src={topic?.user?.image}
                        alt="profile picture"
                        className="profilePic"
                      />
                    </div>
                  </div>
                  <div className="user_info">
                    <div className="userName">{topic?.user?.name}</div>
                    <div className="postTime">
                      {moment(topic?.created_at).startOf("s").fromNow()}
                    </div>
                  </div>
                </div>
              </div>
              {topic.categories?.length ? (
                <div className="categoriesTags">
                  {topic.categories.map((category, index) => (
                    <div className="tag" key={index}>
                      {category?.name}
                    </div>
                  ))}
                </div>
              ) : (
                ""
              )}
              <div className="card_title">{topic.title}</div>
              <div className="card_detail">{topic.description}</div>
              {topic?.image ? (
                <div className="card_image">
                  <img src={topic.image} className="postImage" />
                </div>
              ) : (
                ""
              )}
              <div
                className="card_footer"
                style={
                  browserWidth < mobileWidth
                    ? { marginLeft: "16px", paddingBottom: "8px" }
                    : {}
                }
              >
                <div className="profile_side">
                  <div
                    className="follower_img_container"
                    style={{ height: "32px", width: "39px" }}
                  >
                    {topic?.followers.length > 0 &&
                      topic?.followers
                        ?.slice(0, 3)
                        ?.map((item, key) => (
                          <img
                            key={key}
                            src={`${item?.image}`}
                            className="imgStylingProfiles"
                          />
                        ))}
                    <div className="followerText" style={{ marginTop: "5px" }}>
                      <p style={{ width: "100px" }}>
                        {topic?.number_of_followers > 0
                          ? `${topic?.number_of_followers} ${t("Followers")}`
                          : topic?.number_of_followers === 1
                          ? `${topic?.number_of_followers} ${t("Follower")} `
                          : `${t("No Followers")}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="message_side">
                  <div className="message_text_container">
                    <img
                      src={messageIcon}
                      className="imgStylingMessage"
                      style={{ width: "30px", height: "revert" }}
                    />
                  </div>
                  <div
                    className="messageText"
                    style={
                      browserWidth < mobileWidth
                        ? { color: "gray" }
                        : { color: "inherit" }
                    }
                  >
                    {topic.number_of_comments}
                  </div>
                </div>
              </div>
            </Box>
          </div>
        </div>
      </>
    </Box>
  );
};

export default TopicCard;
