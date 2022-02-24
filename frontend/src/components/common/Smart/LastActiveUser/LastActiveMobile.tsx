import "@src/components/common/Smart/DocumentationSection/DocumentationSectionMobile.scss";
import { Box } from "@mui/material";

import LastActiveMobileCards from "@src/components/common/Presentational/LastActiveMobileCards/LastActiveMobileCards";
interface LastActiveMobileProps {
  lastActiveDoc: LastActiveMobileCards[];
}
const LastActiveMobile = ({ lastActiveDoc }: LastActiveMobileProps) => {
  return (
    <Box className="last_active_mobile_section">
      {lastActiveDoc?.map((doc, i) => (
        <LastActiveMobileCards key={i} doc={doc} />
      ))}
    </Box>
  );
};

export default LastActiveMobile;
