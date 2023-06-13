import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import SectionSkeleton from "@src/components/common/presentational/sectionSkeleton/SectionSkeleton";
import DocumentationDescription from "@src/components/common/smart/documentationDescription/DocumentationDescription";
import NoDataFound from "@src/components/shared/noDataFound/NoDataFound";
import { api } from "@src/store/reducers/api";

export default function ArticleDocumentation() {
  const { t } = useTranslation();
  const { docId } = useParams<{ docId: string }>();
  const { data, isLoading } = api.useGetArticleQuery({ id: parseInt(docId) });
  return (
    <>
      {!isLoading ? (
        <>
          {data ? (
            <DocumentationDescription />
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
}
