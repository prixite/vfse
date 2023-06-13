import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import SectionSkeleton from "@src/components/common/presentational/sectionSkeleton/SectionSkeleton";
import TopicDetail from "@src/components/common/smart/topicDetail/TopicDetail";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { api } from "@src/store/reducers/api";
const TopicView = () => {
  const { t } = useTranslation();
  const { topicId } = useParams<{ topicId: string }>();
  const { data, isLoading } = api.useGetTopicQuery({ id: topicId });
  return (
    <>
      {!isLoading ? (
        <>
          {data ? (
            <TopicDetail />
          ) : (
            <NoDataFound
              title={t("Sorry! No results found. :(")}
              description={t("Try Again")}
            />
          )}
        </>
      ) : (
        <SectionSkeleton />
      )}
    </>
  );
};

export default TopicView;
