import { useState, useEffect } from "react";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Button } from "@mui/material";
import "@src/components/common/presentational/topicUpdatesCards/topicUpdatesCard.scss";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import messageIcon from "@src/assets/svgs/message.svg";
import { constants } from "@src/helpers/utils/constants";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/api";
import {
  TopicCategory,
  useVfseTopicsFollowPartialUpdateMutation,
  User2,
} from "@src/store/reducers/generated";

interface TopicUpdatesCards {
  id: number;
  cardTitle: string;
  numberOfComments?: number;
  numberOfFollowers?: number;
  categories?: TopicCategory[]; //Update TypeScript!
  user: User2;
  followers?: User2[];
}

const TopicUpdatesCards = ({
  id,
  cardTitle,
  numberOfComments,
  numberOfFollowers,
  categories,
  user,
  followers,
}: TopicUpdatesCards) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { organizationRoute } = constants;
  const [isFollowing, setIsFollowing] = useState(
    followers.some((follower) => follower?.id === me?.id)
  );
  const selectedOrganization = useSelectedOrganization();
  const [updateFollowUnfollowTopic] =
    useVfseTopicsFollowPartialUpdateMutation();
  const { data: me } = useOrganizationsMeReadQuery(
    {
      id: selectedOrganization?.id.toString(),
    },
    {
      skip: !selectedOrganization,
    }
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

  const expandOnClick = () => {
    navigate(
      `/${organizationRoute}/${selectedOrganization?.id}/forum/topic/${id}`
    );
  };

  return (
    <>
      <Box
        component="div"
        className="TopicUpdatesCard"
        style={{ cursor: "pointer" }}
        onClick={expandOnClick}
      >
        <Box
          component="div"
          className="card_header"
          style={{ alignItems: "center" }}
        >
          <div className="categoriesTags" style={{ marginTop: "0px" }}>
            {categories?.length ? (
              <>
                {categories?.map((category, index) => (
                  <div className="tag" key={index}>
                    {category?.name}
                  </div>
                ))}
              </>
            ) : (
              ""
            )}
          </div>

          {me?.id !== user?.id ? (
            <div style={{ overflow: "hidden" }}>
              <Button
                variant="contained"
                className="follow"
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
                    <p className="text" style={{ color: "#568000" }}>
                      {t("Following")}
                    </p>
                  </>
                ) : (
                  <p className="text"> {t("Follow")} </p>
                )}
              </Button>
            </div>
          ) : (
            ""
          )}
        </Box>
        <div className="card_detail" style={{ cursor: "pointer" }}>
          {cardTitle}
        </div>
        <Box component="div" className="card_footer">
          <div className="follower_img_container">
            {followers.length > 0 && (
              <div className="follower-img">
                {followers?.slice(0, 3)?.map((item, key) => (
                  <img
                    key={key}
                    src={`${item?.image}`}
                    className="imgStylingProfiles"
                  />
                ))}
              </div>
            )}
            <div className="followerText">
              {numberOfFollowers > 0
                ? `${numberOfFollowers} Followers`
                : numberOfFollowers === 1
                ? `${numberOfFollowers} Follower `
                : `No Followers`}
            </div>
          </div>
          <div className="message_side" style={{ cursor: "pointer" }}>
            <div className="message_text_container">
              <img className="imgStylingMessage" src={messageIcon} />
            </div>
            <div className="messageText">{numberOfComments} </div>
          </div>
        </Box>
      </Box>
    </>
  );
};

export default TopicUpdatesCards;
