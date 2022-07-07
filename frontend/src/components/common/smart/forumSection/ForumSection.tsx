import { useEffect, useMemo, useState } from "react";

import { Box, Pagination, Stack } from "@mui/material";

// import useStyles from "@src/components/common/smart/forumSection/Styles";
import ProfileTimeline from "@src/components/common/smart/profileTimeline/ProfileTimeline";
import VfseTopSection from "@src/components/common/smart/vfseTopSection/VfseTopSection";
import TopicModal from "@src/components/shared/popUps/topicModal/TopicModal";
import { linkParser } from "@src/helpers";
import { localizedData } from "@src/helpers/utils/language";
import { api } from "@src/store/reducers/api";
import { VfseTopicsListApiResponse } from "@src/store/reducers/generated";

const { forum, title } = localizedData().Forum;
export default function ForumSection() {
  const [page, setPage] = useState(1);
  const {
    data: topicsList = { data: [], link: "" },
    // isLoading: isTopicsLoading,
  } = api.useGetTopicsListQuery({ page }); //Arr1 Paginated

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

  const topicsPagination = useMemo(
    () => linkParser(topicsList.link),
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
          setPaginatedTopics={setPaginatedTopics}
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
              count={topicsPagination?.length + 1}
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
