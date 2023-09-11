import { useEffect, useState } from "react";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Button } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import messageIcon from "@src/assets/svgs/message.svg";
import useStyles from "@src/components/common/presentational/profileTimeLineCards/Styles";
import { constants } from "@src/helpers/utils/constants";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/api";
import {
  User2,
  TopicCategory,
  useVfseTopicsFollowPartialUpdateMutation,
} from "@src/store/reducers/generatedWrapper";

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
  const { t } = useTranslation();
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
  const navigate = useNavigate();
  const { organizationRoute } = constants;

  const [updateFollowUnfollowTopic] =
    useVfseTopicsFollowPartialUpdateMutation();
  const [isFollowing, setIsFollowing] = useState(
    followers?.some((follower) => follower?.id === me?.id)
  );

  useEffect(() => {
    setIsFollowing(followers?.some((follower) => follower?.id === me?.id));
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
              navigate(
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
                    {moment(createdAt).startOf("s").fromNow()}
                  </div>
                </div>
              </div>
              {me?.id !== user?.id ? (
                <Button
                  variant="contained"
                  className={classes.follow}
                  disabled={me?.view_only}
                  onClick={handleFollowToggler}
                  style={{
                    backgroundColor: `${isFollowing ? "#D3F887" : "#92d509"}`,
                    opacity: `${me?.view_only ? "0.5" : ""}`,
                  }}
                >
                  {isFollowing ? (
                    <>
                      <DoneAllIcon
                        style={{ color: "#568000", marginRight: "9px" }}
                      />
                      <p className={classes.text} style={{ color: "#568000" }}>
                        {t("Following")}
                      </p>
                    </>
                  ) : (
                    <p className={classes.text}>{t("Follow")}</p>
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
                {/* <AvatarGroup
                  max={4}
                  spacing={1}
                  componentsProps={{
                    additionalAvatar: {
                      sx: { display: "none" },
                    },
                  }}
                >
                  {followers?.map((item) => {
                    return (
                      <Avatar
                        alt={item?.name}
                        src={item?.image}
                        sx={{ width: 35, height: 32 }}
                      />
                    );
                  })}
                </AvatarGroup> */}
                {followers.length > 0 && (
                  <div className="person-follower-img">
                    {followers?.slice(0, 3)?.map((item, key) => (
                      <img
                        key={key}
                        src={`${item?.image}`}
                        className={classes.imgStylingProfiles}
                      />
                    ))}
                  </div>
                )}
                <div className={classes.followerText}>
                  {" "}
                  {number_of_followers > 0
                    ? `${number_of_followers} Followers`
                    : number_of_followers === 1
                    ? `${number_of_followers} Follower `
                    : `No Followers`}
                </div>
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
