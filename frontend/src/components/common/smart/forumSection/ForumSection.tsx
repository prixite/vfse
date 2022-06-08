import { useState } from "react";

import { Box } from "@mui/material";

import ProfileTimeline from "@src/components/common/smart/profileTimeline/ProfileTimeline";
import VfseTopSection from "@src/components/common/smart/vfseTopSection/VfseTopSection";
import TopicModal from "@src/components/shared/popUps/topicModal/TopicModal";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/smart/forumSection/forumSection.scss";
import { VfseTopicsListApiResponse } from "@src/store/reducers/generated";

const { forum, title } = localizedData().Forum;
export default function ForumSection() {
  const [paginatedTopics, setPaginatedTopics] =
    useState<VfseTopicsListApiResponse>([]);

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
        {/* PopularTopis */}
        <VfseTopSection
          setOpen={setOpen}
          title={title}
          seeAll=""
          setPaginatedTopics={setPaginatedTopics}
        />
        {/* ProfileTimeLine */}
        <ProfileTimeline
          paginatedTopics={paginatedTopics}
          setPaginatedTopics={setPaginatedTopics}
        />
      </Box>
      {open ? <TopicModal open={open} handleClose={handleClose} /> : ""}
    </>
  );
}
