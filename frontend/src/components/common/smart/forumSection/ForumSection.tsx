import { useEffect, useState } from "react";

import { Box, Pagination, Stack } from "@mui/material";

// import useStyles from "@src/components/common/smart/forumSection/Styles";
import ProfileTimeline from "@src/components/common/smart/profileTimeline/ProfileTimeline";
import VfseTopSection from "@src/components/common/smart/vfseTopSection/VfseTopSection";
import TopicModal from "@src/components/shared/popUps/topicModal/TopicModal";
import { localizedData } from "@src/helpers/utils/language";
import { api } from "@src/store/reducers/api";
import { VfseTopicsListApiResponse } from "@src/store/reducers/generated";

const { forum, title } = localizedData().Forum;
export default function ForumSection() {
  const {
    data: topicsList = { data: [], link: "" },
    // isLoading,
  } = api.useGetTopicsListQuery({}); //Arr1 Paginated

  const { data: popularTopicData = [] } = api.useGetPopularTopicsQuery(); //Arr2 PopularTopics

  const [paginatedTopics, setPaginatedTopics] =
    useState<VfseTopicsListApiResponse>([]);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const [page, setPage] = useState(1);
  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  useEffect(() => {
    paginate();
  }, [page, topicsList, popularTopicData]);

  const paginate = (
    topics = topicsList.data,
    pageSize = 10,
    pageNumber = page
  ) => {
    const tempArr = [...topics].slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setPaginatedTopics(tempArr);
  };
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
              count={
                Math.ceil(
                  (topicsList.data.length + popularTopicData.length) / 10
                ) || 1
              }
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
