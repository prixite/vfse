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
    data: topicsList = [],
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
    paginate(topicsList, 10, page);
  }, [page, topicsList]);

  const paginate = (array, pageSize, pageNumber) => {
    const A1 = JSON.parse(JSON.stringify(topicsList));
    const A2 = JSON.parse(JSON.stringify(popularTopicData));
    const A3 = [...A1, ...A2];

    const newPaginatedTopicsArray = A3.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setPaginatedTopics(newPaginatedTopicsArray);
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
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Pagination
            defaultPage={1}
            count={
              Math.ceil((topicsList.length + popularTopicData.length) / 10) || 1
            }
            onChange={handlePagination}
            size="large"
          />
        </Stack>
        {/* Pagination End  */}
      </Box>
      {open ? <TopicModal open={open} handleClose={handleClose} /> : ""}
    </>
  );
}
