import { useParams } from "react-router-dom";

import SectionSkeleton from "@src/components/common/presentational/sectionSkeleton/SectionSkeleton";
import CategoryDetailSection from "@src/components/common/smart/categoryDetailSection/CategoryDetailSection";
import { api } from "@src/store/reducers/api";
const CategoryDetailView = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { isLoading } = api.useGetCategoryQuery({
    id: parseInt(categoryId),
  });
  return <>{!isLoading ? <CategoryDetailSection /> : <SectionSkeleton />}</>;
};

export default CategoryDetailView;
