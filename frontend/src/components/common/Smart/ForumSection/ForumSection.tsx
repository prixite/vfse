import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";

import ProfileTimeline from "@src/components/common/Smart/ProfileTimeline/ProfileTimeline";
import TopicUpdatesSection from "@src/components/common/Smart/TopicUpdatesSection/TopicUpdatesSection";
import VfseTopSection from "@src/components/common/Smart/VfseTopSection/VfseTopSection";
import useWindowSize from "@src/components/shared/CustomHooks/useWindowSize";
import TopicModal from "@src/components/shared/popUps/TopicModal/TopicModal";
import { mobileWidth } from "@src/helpers/utils/config";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/Smart/ForumSection/ForumSection.scss";
import { useAppSelector } from "@src/store/hooks";

const { forum, title } = localizedData().Forum;
export default function ForumSection() {
  const [browserWidth] = useWindowSize();
  const [open, setOpen] = useState(false);
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      {browserWidth > mobileWidth ? (
        <div className="ForumSection">
          <h2 className="heading" style={{ marginBottom: "32px" }}>
            {forum}
          </h2>
          <VfseTopSection setOpen={setOpen} />
          {open ? <TopicModal open={open} handleClose={handleClose} /> : ""}
          <TopicUpdatesSection title={title} seeAll="" />
          <ProfileTimeline />
        </div>
      ) : (
        <div className="mobileForumSection">
          <div className="forumHeader">
            <h2 className="heading">{forum}</h2>
            <Button
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              variant="contained"
              className="AddTopicsbtn"
            >
              <div className="btn-content">
                <AddIcon />
              </div>
            </Button>
          </div>
          <VfseTopSection />
          <ProfileTimeline />
        </div>
      )}
    </>
  );
}
