import TableSkeleton from "@src/components/common/presentational/tableSkeleton/TableSkeleton";
import DocumentationSection from "@src/components/common/smart/documentationSection/DocumentationSection";
import { useProductsModelsListQuery } from "@src/store/reducers/api";

export default function DocumentationView() {
  const { isLoading } = useProductsModelsListQuery({});

  return <>{!isLoading ? <DocumentationSection /> : <TableSkeleton />}</>;
}
