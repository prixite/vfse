import { useState, useEffect, Dispatch, SetStateAction } from "react";

import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DoneIcon from "@mui/icons-material/Done";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

import useStyles from "@src/components/common/presentational/topicToggler/Styles";
import { getTopicListArg } from "@src/types/interfaces";

interface TopicTogglerInterface {
  setTopicListPayload: Dispatch<SetStateAction<getTopicListArg>>;
  topicListPayload: getTopicListArg;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}
export default function TopicToggler({
  setTopicListPayload,
  topicListPayload,
  setPage,
}: TopicTogglerInterface) {
  const { t } = useTranslation();
  const classes = useStyles();
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
        if (!topicListPayload.followed) setPage(1); //reset page count on filter change
        setTopicListPayload({ followed: true });
        break;
      case "created":
        if (!topicListPayload.created) setPage(1); //reset page count on filter change
        setTopicListPayload({ created: true });
        break;
    }
  };
  useEffect(() => {
    topicListApiArgHandler();
  }, [view]);
  return (
    <>
      <Box component="div" className={classes.card}>
        <ToggleButtonGroup
          orientation="vertical"
          value={view}
          exclusive
          onChange={handleChange}
          className={classes.togglers}
        >
          <ToggleButton
            value="allTopics"
            aria-label="list"
            className={`${classes.setter} ${classes.customToggleBtn}`}
            // style={{
            //   backgroundColor: "unset !important",
            //   background: "unset !important",
            //   border: "unset",
            //   padding: "unset",
            //   display: "flex",
            //   justifyContent: "space-between",
            //   alignItems: "center",
            // }}
          >
            <div className={classes.grouped}>
              <ChatBubbleOutlineIcon
                style={{
                  color: `${view === "allTopics" ? "#773CBD" : "#DADADA"}`,
                  width: "20px",
                  height: "20px",
                }}
              />
              <p
                className={classes.choiceDescription}
                style={view === "allTopics" ? { color: "#773CBD" } : {}}
              >
                {" "}
                {t("All topics")}{" "}
              </p>
            </div>
            {view === "allTopics" ? (
              <DoneIcon style={{ color: "#773CBD" }} />
            ) : (
              ""
            )}
          </ToggleButton>

          <ToggleButton
            value="followed"
            aria-label="module"
            className={`${classes.setter} ${classes.customToggleBtn}`}
          >
            <div className={classes.grouped}>
              <BookmarkBorderIcon
                style={{
                  color: `${view === "followed" ? "#773CBD" : "#DADADA"}`,
                  width: "20px",
                  height: "20px",
                }}
              />
              <p
                className={classes.choiceDescription}
                style={view === "followed" ? { color: "#773CBD" } : {}}
              >
                {" "}
                {t("Followed topics")}{" "}
              </p>
            </div>
            {view === "followed" ? (
              <DoneIcon style={{ color: "#773CBD" }} />
            ) : (
              ""
            )}
          </ToggleButton>

          <ToggleButton
            value="created"
            aria-label="quilt"
            className={`${classes.setter} ${classes.customToggleBtn}`}
          >
            <div className={classes.grouped}>
              <GroupAddOutlinedIcon
                style={{
                  color: `${view === "created" ? "#773CBD" : "#DADADA"}`,
                  width: "20px",
                  height: "20px",
                }}
              />
              <p
                className={classes.choiceDescription}
                style={view === "created" ? { color: "#773CBD" } : {}}
              >
                {" "}
                {t("Created topics")}{" "}
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
