import { useEffect, useMemo, useState } from "react";

import { Box } from "@mui/material";
// import useStyles from "@src/components/common/smart/forumSection/Styles";
import { useTranslation } from "react-i18next";

import ProfileTimeline from "@src/components/common/smart/profileTimeline/ProfileTimeline";
import VfseTopSection from "@src/components/common/smart/vfseTopSection/VfseTopSection";
import TopicModal from "@src/components/shared/popUps/topicModal/TopicModal";
import { parseLink } from "@src/helpers/paging";
import { api } from "@src/store/reducers/api";
import { VfseTopicsListApiResponse } from "@src/store/reducers/generatedWrapper";
import { getTopicListArg } from "@src/types/interfaces";
export default function ForumSection() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [topicListPayload, setTopicListPayload] = useState<getTopicListArg>({});
  const {
    data: topicsList = { data: [], link: "" },
    // isLoading: isTopicsLoading,
  } = api.useGetTopicsListQuery({ page, ...topicListPayload });
  const [paginatedTopics, setPaginatedTopics] =
    useState<VfseTopicsListApiResponse>([]);
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setPage(value);
  };
  useEffect(() => {
    if (topicsList.data && topicsList.data.length) {
      setPaginatedTopics(topicsList.data);
    }
  }, [topicsList?.data]);
  const totalTopicPages = useMemo(
    () => parseLink(topicsList?.link) || 1,
    [topicsList?.data]
  );
  return (
    <>
      <Box component="div">
        <h2 style={{ marginBottom: "32px" }}>{t("Forum")}</h2>
        {/* PopularTopis */}
        <VfseTopSection
          setOpen={setOpen}
          title={t("Popular topics")}
          seeAll=""
          paginatedTopics={paginatedTopics}
          setPaginatedTopics={setPaginatedTopics}
        />
        {/* ProfileTimeLine */}
        <ProfileTimeline
          paginatedTopics={paginatedTopics}
          setTopicListPayload={setTopicListPayload}
          topicListPayload={topicListPayload}
          setPage={setPage}
          page={page}
          count={totalTopicPages}
          onChange={handlePagination}
        />
      </Box>
      {open ? <TopicModal open={open} handleClose={handleClose} /> : ""}
    </>
  );
}
