import { useState } from "react";

import { Box } from "@mui/material";

import ProfileTimeline from "@src/components/common/smart/profileTimeline/ProfileTimeline";
import TopicUpdatesSection from "@src/components/common/smart/topicUpdatesSection/TopicUpdatesSection";
import VfseTopSection from "@src/components/common/smart/vfseTopSection/VfseTopSection";
import TopicModal from "@src/components/shared/popUps/topicModal/TopicModal";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/smart/forumSection/forumSection.scss";

const { forum, title } = localizedData().Forum;
export default function ForumSection() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Box component="div" className="ForumSection">
        <h2 className="heading" style={{ marginBottom: "32px" }}>
          {forum}
        </h2>
        <VfseTopSection setOpen={setOpen} />
        <TopicUpdatesSection title={title} seeAll="" />
        <ProfileTimeline />
      </Box>
      {open ? <TopicModal open={open} handleClose={handleClose} /> : ""}
    </>
  );
}
