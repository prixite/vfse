import SectionSkeleton from "@src/components/common/presentational/sectionSkeleton/SectionSkeleton";
import FaqSection from "@src/components/common/smart/faqSection/FaqSection";
import { api } from "@src/store/reducers/api";
export default function FaqView() {
  const { isLoading } = api.useGetDashboardListQuery();
  return <>{!isLoading ? <FaqSection /> : <SectionSkeleton />}</>;
}
