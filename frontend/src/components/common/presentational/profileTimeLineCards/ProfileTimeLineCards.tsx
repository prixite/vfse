import { Box } from "@mui/material";
import { useHistory } from "react-router-dom";

import messageIcon from "@src/assets/svgs/message.svg";
import { constants } from "@src/helpers/utils/constants";
import { useSelectedOrganization } from "@src/store/hooks";
import "@src/components/common/presentational/profileTimeLineCards/profileTimelineCards.scss";
import { User2, TopicCategory } from "@src/store/reducers/generated";
interface ProfileTimelineCards {
  id: number;
  title: string;
  description: string;
  number_of_comments: number;
  number_of_followers: number;
  reply_email_notification?: boolean;
  user: User2;
  image?: string;
  categories: TopicCategory[];
  followers?: unknown[];
}

const ProfileTimelineCards = ({
  id,
  title,
  description,
  number_of_comments,
  number_of_followers,
  user,
  image,
  categories,
}: ProfileTimelineCards) => {
  const selectedOrganization = useSelectedOrganization();
  const { organizationRoute } = constants;
  const history = useHistory();
  return (
    <>
      <div className="timelineInfo">
        <div className="timelineCards">
          <Box component="div" className="card">
            <div className="card_header">
              <div className="userInfoWrapper">
                <div className="topic_updates_imags">
                  <div className="imgStyling">
                    <img
                      src={user?.image}
                      alt="profile picture"
                      className="profilePic"
                    />
                  </div>
                </div>
                <div className="user_info">
                  <div className="userName">{user?.name}</div>
                  <div className="postTime">3 hours ago</div>
                </div>
              </div>
            </div>
            {categories?.length ? (
              <div className="categoriesTags">
                {categories.map((category, index) => (
                  <div className="tag" key={index}>
                    {category?.name}
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
            <div className="card_title">{title}</div>
            <div className="card_detail">{description}</div>
            <div className="card_image">
              <img src={image} className="postImage" />
            </div>
            <div className="card_footer">
              <div className="profile_side">
                <div className="followerText">{`${number_of_followers} followers`}</div>
              </div>
              <div
                className="message_side"
                onClick={() =>
                  history.push(
                    `/${organizationRoute}/${selectedOrganization?.id}/forum/topic/${id}`
                  )
                }
              >
                <div className="message_text_container">
                  <img src={messageIcon} className="imgStylingMessage" />
                </div>
                <div className="messageText">{number_of_comments}</div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
};

export default ProfileTimelineCards;
