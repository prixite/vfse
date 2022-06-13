import { useEffect, useState } from "react";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Button } from "@mui/material";
import moment from "moment";
import { useHistory } from "react-router-dom";

import messageIcon from "@src/assets/svgs/message.svg";
import useStyles from "@src/components/common/presentational/profileTimeLineCards/Styles";
import { constants } from "@src/helpers/utils/constants";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/api";
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
  createdAt?: string;
  // updatedAt?: string;
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
  createdAt,
}: ProfileTimelineCards) => {
  const classes = useStyles();
  const selectedOrganization = useSelectedOrganization();
  const { data: me } = useOrganizationsMeReadQuery(
    {
      id: selectedOrganization?.id.toString(),
    },
    {
      skip: !selectedOrganization,
    }
  );
  const history = useHistory();
  const { organizationRoute } = constants;

  const [updateFollowUnfollowTopic] =
    useVfseTopicsFollowPartialUpdateMutation();
  const [isFollowing, setIsFollowing] = useState(
    followers.some((follower) => follower?.id === me?.id)
  );

  useEffect(() => {
    setIsFollowing(followers.some((follower) => follower?.id === me?.id));
  }, [followers]);

  const handleFollowToggler = (event) => {
    event.stopPropagation();
    setIsFollowing(!isFollowing);
    updateFollowUnfollowTopic({
      id: id.toString(),
      followUnfollow: { follow: !isFollowing },
    }).unwrap();
  };

  return (
    <>
      <div className={classes.timelineInfo}>
        <div>
          <Box
            component="div"
            className={classes.card}
            style={{ cursor: "pointer" }}
            onClick={() =>
              history.push(
                `/${organizationRoute}/${selectedOrganization?.id}/forum/topic/${id}`
              )
            }
          >
            <div className={classes.cardHeader}>
              <div className={classes.userInfoWrapper}>
                <div className="topic_updates_imags">
                  <div className={classes.imgStyling}>
                    <img
                      src={user?.image}
                      alt="profile picture"
                      className={classes.profilePic}
                    />
                  </div>
                </div>
                <div className={classes.userInfo}>
                  <div className={classes.userName}>{user?.name}</div>
                  <div className={classes.postTime}>
                    {" "}
                    {moment(createdAt).startOf("minutes").fromNow()}
                  </div>
                </div>
              </div>
              {me?.id !== user?.id ? (
                <Button
                  variant="contained"
                  className={classes.follow}
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
                      <p className={classes.text} style={{ color: "#568000" }}>
                        Following
                      </p>
                    </>
                  ) : (
                    <p className={classes.text}>Follow</p>
                  )}
                </Button>
              ) : (
                ""
              )}
            </div>

            {categories?.length ? (
              <div className={classes.categoriesTags}>
                {categories.map((category, index) => (
                  <div className={classes.tag} key={index}>
                    {category?.name}
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}

            <div className={classes.cardTitle}>{title}</div>
            <div className={classes.cardDetail}>{description}</div>
            {image?.length ? (
              <div className={classes.cardImage}>
                <img src={image} className={classes.postImage} />
              </div>
            ) : (
              ""
            )}
            <div className={classes.cardFooter}>
              <div className={classes.profileSide}>
                <div
                  className={classes.followerText}
                >{`${number_of_followers} followers`}</div>
              </div>
              <div className={classes.messageSide}>
                <div className={classes.messageTextContainer}>
                  <img
                    src={messageIcon}
                    className={classes.imgStylingMessage}
                  />
                </div>
                <div className={classes.messageText}>{number_of_comments}</div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
};

export default ProfileTimelineCards;
