import { useState, useEffect } from "react";

import DoneAllIcon from "@mui/icons-material/DoneAll";
import { Box, Button } from "@mui/material";

import "@src/components/common/presentational/topicUpdatesCards/topicUpdatesCard.scss";
import followersIcon from "@src/assets/svgs/followers.svg";
import messageIcon from "@src/assets/svgs/message.svg";
import { useSelectedOrganization } from "@src/store/hooks";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/api";
import {
  TopicCategory,
  User2,
  useVfseTopicsFollowPartialUpdateMutation,
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
  const handleFollowToggler = () => {
    setIsFollowing(!isFollowing);
    updateFollowUnfollowTopic({
      id: id.toString(),
      followUnfollow: { follow: !isFollowing },
    }).unwrap();
  };
  useEffect(() => {
    setIsFollowing(followers.some((follower) => follower?.id === me?.id));
  }, [followers]);
  return (
    <>
      <Box component="div" className="TopicUpdatesCard">
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
        </Box>
        <div className="card_detail">{cardTitle}</div>
        <Box component="div" className="card_footer">
          <div className="profile_side">
            <div className="follower_img_container">
              <img src={followersIcon} className="imgStylingProfiles" />
            </div>
            <div className="followerText">{numberOfFollowers}</div>
          </div>
          <div className="message_side">
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
