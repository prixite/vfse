// import CountingInfoCards from "@src/components/common/Presentational/CountingInfoCards/CountingInfoCards";
import { Box, Grid } from "@mui/material";
import { localizedData } from "@src/helpers/utils/language";
import "@src/components/common/Smart/ForumSection/ForumSection.scss";


const { forum } = localizedData().Forum;
export default function ForumSection() {
  
  return (
    <div className="VfseDashboardSection">
      <h2 className="heading">{forum}</h2>
    </div>
  );
}
