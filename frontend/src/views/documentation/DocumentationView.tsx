import DocumentationSection from "@src/components/common/Smart/DocumentationSection/DocumentationSection";
import { useProductsModelsListQuery } from "@src/store/reducers/api";

export default function DocumentationView() {
  const { isLoading } = useProductsModelsListQuery();

  return <>{!isLoading ? <DocumentationSection /> : <p>Loading...</p>}</>;
}
