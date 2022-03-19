import "@src/components/common/smart/documentationSection/documentationSectionMobile/documentationSectionMobile.scss";
import { Box } from "@mui/material";

import "@src/components/common/smart/lastActiveUser/lastActiveMobile/lastActiveMobile.scss";
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
