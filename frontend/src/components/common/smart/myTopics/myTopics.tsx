import { useEffect, useMemo, useState } from "react";

import { Pagination, Stack } from "@mui/material";

import { parseLink } from "@src/helpers/paging";
import { useVfseUserTopicListQuery } from "@src/store/reducers/generated";

import ProfileTimelineCards from "../../presentational/profileTimeLineCards/ProfileTimeLineCards";

const MyTopics = () => {
  const [paginatedTopics, setPaginatedTopics] = useState([]);
  const [page, setPage] = useState(1);
  const { data: topicsList } = useVfseUserTopicListQuery({
    page,
  });

  useEffect(() => {
    setPaginatedTopics(topicsList);
  }, [topicsList]);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    event.preventDefault();
    setPage(value);
  };

  const totalTopicPages = useMemo(() => parseLink("") || 1, [topicsList]);

  return (
    <>
      {paginatedTopics?.map((item) => {
        return (
          <ProfileTimelineCards
            key={item?.id}
            id={item?.id}
            description={item?.description}
            title={item?.title}
            user={item?.user}
            image={item?.image}
            number_of_comments={item?.number_of_comments}
            number_of_followers={item?.number_of_followers}
            categories={item?.categories}
            followers={item?.followers}
            reply_email_notification={item?.reply_email_notification}
            createdAt={item?.created_at}
          />
        );
      })}
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
    </>
  );
};

export default MyTopics;
