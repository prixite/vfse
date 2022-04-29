import "@src/components/common/smart/documentationSection/documentationSectionMobile/documentationSectionMobile.scss";
import { Box } from "@mui/material";

import "@src/components/common/smart/lastActiveUser/lastActiveMobile/lastActiveMobile.scss";
import LastActiveMobileCards from "@src/components/common/presentational/lastActiveMobileCards/LastActiveMobileCards";
import { UsersActiveUsersListApiResponse } from "@src/store/reducers/generated";

interface LastActiveMobileProps {
  lastActiveDoc: UsersActiveUsersListApiResponse;
}
const LastActiveMobile = ({ lastActiveDoc }: LastActiveMobileProps) => {
  return (
    <Box className="last_active_mobile_section">
      {lastActiveDoc?.map((doc, index) => (
        <LastActiveMobileCards key={index} doc={doc} />
      ))}
    </Box>
  );
};

export default LastActiveMobile;
