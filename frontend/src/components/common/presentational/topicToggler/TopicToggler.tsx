import { useState, useEffect, Dispatch, SetStateAction } from "react";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DoneIcon from "@mui/icons-material/Done";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";

import { getTopicListArg } from "@src/types/interfaces";
import "@src/components/common/presentational/topicToggler/topicToggler.scss";

interface TopicTogglerInterface {
  setTopicListPayload: Dispatch<SetStateAction<getTopicListArg>>;
}
export default function TopicToggler({
  setTopicListPayload,
}: TopicTogglerInterface) {
  const [view, setView] = useState("allTopics");
  const handleChange = (event, nextView) => {
    setView(nextView);
  };

  const topicListApiArgHandler = () => {
    switch (view) {
      case "allTopics":
        setTopicListPayload({});
        break;
      case "followed":
        setTopicListPayload({ followed: true });
        break;
      case "created":
        setTopicListPayload({ created: true });
        break;
    }
  };
  useEffect(() => {
    topicListApiArgHandler();
  }, [view]);
  return (
    <>
      <Box component="div" className="card">
        <ToggleButtonGroup
          orientation="vertical"
          value={view}
          exclusive
          onChange={handleChange}
          className="togglers"
        >
          <ToggleButton value="allTopics" aria-label="list">
            <div className="grouped">
              <ChatBubbleOutlineIcon
                style={{
                  color: `${view === "allTopics" ? "#773CBD" : "#DADADA"}`,
                  width: "20px",
                  height: "20px",
                }}
              />
              <p
                className="choiceDescription"
                style={view === "allTopics" ? { color: "#773CBD" } : {}}
              >
                {" "}
                All topics{" "}
              </p>
            </div>
            {view === "allTopics" ? (
              <DoneIcon style={{ color: "#773CBD" }} />
            ) : (
              ""
            )}
          </ToggleButton>

          <ToggleButton value="followed" aria-label="module">
            <div className="grouped">
              <BookmarkBorderIcon
                style={{
                  color: `${view === "followed" ? "#773CBD" : "#DADADA"}`,
                  width: "20px",
                  height: "20px",
                }}
              />
              <p
                className="choiceDescription"
                style={view === "followed" ? { color: "#773CBD" } : {}}
              >
                {" "}
                Followed topics{" "}
              </p>
            </div>
            {view === "followed" ? (
              <DoneIcon style={{ color: "#773CBD" }} />
            ) : (
              ""
            )}
          </ToggleButton>

          <ToggleButton value="created" aria-label="quilt">
            <div className="grouped">
              <GroupAddOutlinedIcon
                style={{
                  color: `${view === "created" ? "#773CBD" : "#DADADA"}`,
                  width: "20px",
                  height: "20px",
                }}
              />
              <p
                className="choiceDescription"
                style={view === "created" ? { color: "#773CBD" } : {}}
              >
                {" "}
                Created topics{" "}
              </p>
            </div>
            {view === "created" ? (
              <DoneIcon style={{ color: "#773CBD" }} />
            ) : (
              ""
            )}
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </>
  );
}
