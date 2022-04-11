import { useParams } from "react-router-dom";

import SectionSkeleton from "@src/components/common/presentational/sectionSkeleton/SectionSkeleton";
import DocumentationDescription from "@src/components/common/smart/documentationDescription/DocumentationDescription";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { localizedData } from "@src/helpers/utils/language";
import { api } from "@src/store/reducers/api";

export default function ArticleDocumentation() {
  const { docId } = useParams<{ docId: string }>();
  const { data, isLoading } = api.useGetArticleQuery({ id: parseInt(docId) });
  const { noDataTitle, noDataDescription } = localizedData().systems;
  return (
    <>
      {!isLoading ? (
        <>
          {data ? (
            <DocumentationDescription />
          ) : (
            <NoDataFound title={noDataTitle} description={noDataDescription} />
          )}
        </>
      ) : (
        <SectionSkeleton />
      )}
    </>
  );
}
