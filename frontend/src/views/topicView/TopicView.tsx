import { useParams } from "react-router-dom";

import SectionSkeleton from "@src/components/common/presentational/sectionSkeleton/SectionSkeleton";
import TopicDetail from "@src/components/common/smart/topicDetail/TopicDetail";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { localizedData } from "@src/helpers/utils/language";
import { api } from "@src/store/reducers/api";
const TopicView = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { data, isLoading } = api.useGetTopicQuery({ id: topicId });
  const { noDataTitle, noDataDescription } = localizedData().systems;
  return (
    <>
      {!isLoading ? (
        <>
          {data ? (
            <TopicDetail />
          ) : (
            <NoDataFound title={noDataTitle} description={noDataDescription} />
          )}
        </>
      ) : (
        <SectionSkeleton />
      )}
    </>
  );
};

export default TopicView;
