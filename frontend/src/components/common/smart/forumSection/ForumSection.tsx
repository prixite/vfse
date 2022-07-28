import { useEffect, useMemo, useState } from "react";

import { Box, Pagination, Stack } from "@mui/material";

// import useStyles from "@src/components/common/smart/forumSection/Styles";
import ProfileTimeline from "@src/components/common/smart/profileTimeline/ProfileTimeline";
import VfseTopSection from "@src/components/common/smart/vfseTopSection/VfseTopSection";
import TopicModal from "@src/components/shared/popUps/topicModal/TopicModal";
import { parseLink } from "@src/helpers/paging";
import { localizedData } from "@src/helpers/utils/language";
import { api } from "@src/store/reducers/api";
import { VfseTopicsListApiResponse } from "@src/store/reducers/generated";
import { getTopicListArg } from "@src/types/interfaces";

const { forum, title } = localizedData().Forum;
export default function ForumSection() {
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
    setPaginatedTopics(topicsList.data);
  }, [topicsList?.data]);

  const totalTopicPages = useMemo(
    () => parseLink(topicsList?.link) || 1,
    [topicsList?.data]
  );

  return (
    <>
      <Box component="div">
        <h2 style={{ marginBottom: "32px" }}>{forum}</h2>
        {/* PopularTopis */}
        <VfseTopSection
          setOpen={setOpen}
          title={title}
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
        />
        {/* Pagination */}
        {paginatedTopics?.length > 0 && (
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Pagination
              defaultPage={1}
              page={page}
              count={totalTopicPages}
              onChange={handlePagination}
              size="large"
            />
          </Stack>
        )}
        {/* Pagination End  */}
      </Box>
      {open ? <TopicModal open={open} handleClose={handleClose} /> : ""}
    </>
  );
}
