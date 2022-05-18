import { useEffect, useState } from "react";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Button } from "@mui/material";
import { useHistory } from "react-router-dom";

import messageIcon from "@src/assets/svgs/message.svg";
import { constants } from "@src/helpers/utils/constants";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/api";
import "@src/components/common/presentational/profileTimeLineCards/profileTimelineCards.scss";
import {
  User2,
  TopicCategory,
  useVfseTopicsFollowPartialUpdateMutation,
} from "@src/store/reducers/generated";
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
  followers?: User2[];
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
  followers,
}: ProfileTimelineCards) => {
  const selectedOrganization = useSelectedOrganization();
  const { organizationRoute } = constants;
  const history = useHistory();
  const { data: me } = useOrganizationsMeReadQuery(
    {
      id: selectedOrganization?.id.toString(),
    },
    {
      skip: !selectedOrganization,
    }
  );
  const [updateFollowUnfollowTopic] =
    useVfseTopicsFollowPartialUpdateMutation();
  const [isFollowing, setIsFollowing] = useState(
    followers.some((follower) => follower?.id === me?.id)
  );

  const handleFollowToggler = (event) => {
    event.stopPropagation();
    setIsFollowing(!isFollowing);
    updateFollowUnfollowTopic({
      id: id.toString(),
      followUnfollow: { follow: !isFollowing },
    }).unwrap();
  };

  useEffect(() => {
    setIsFollowing(followers.some((follower) => follower?.id === me?.id));
  }, [followers]);

  const expandOnClick = () => {
    history.push(
      `/${organizationRoute}/${selectedOrganization?.id}/forum/topic/${id}`
    );
  };
  return (
    <>
      <div className="timelineInfo">
        <div className="timelineCards">
          <Box
            component="div"
            className="card"
            style={{ cursor: "pointer" }}
            onClick={expandOnClick}
          >
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
              {me?.id !== user?.id ? (
                <Button
                  variant="contained"
                  className="follow"
                  onClick={handleFollowToggler}
                  style={{
                    backgroundColor: `${isFollowing ? "#D3F887" : "#92d509"}`,
                  }}
                >
                  {isFollowing ? (
                    <>
                      <DoneAllIcon
                        style={{ color: "#568000", marginRight: "9px" }}
                      />
                      <p className="text" style={{ color: "#568000" }}>
                        Following
                      </p>
                    </>
                  ) : (
                    <p className="text">Follow</p>
                  )}
                </Button>
              ) : (
                ""
              )}
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
            {image?.length ? (
              <div className="card_image">
                <img src={image} className="postImage" />
              </div>
            ) : (
              ""
            )}
            <div className="card_footer">
              <div className="profile_side">
                <div className="followerText">{`${number_of_followers} followers`}</div>
              </div>
              <div className="message_side">
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
