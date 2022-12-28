import { useParams } from "react-router-dom";

import SectionSkeleton from "@src/components/common/presentational/sectionSkeleton/SectionSkeleton";
import FolderDetailSection from "@src/components/common/smart/folderDetailSection/FolderDetailSection";
import { api } from "@src/store/reducers/api";
const FolderView = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const { isLoading } = api.useGetFolderQuery({ id: parseInt(folderId) });
  return <>{!isLoading ? <FolderDetailSection /> : <SectionSkeleton />}</>;
};

export default FolderView;
