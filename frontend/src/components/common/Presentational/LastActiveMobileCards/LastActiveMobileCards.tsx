import { Box } from "@mui/material";

import "@src/components/common/Presentational/LastActiveMobileCards/LastActiveMobileCards.scss";
import { localizedData } from "@src/helpers/utils/language";

const { healthNetwork, status } = localizedData().Faq;

interface LastActiveMobileCards {
  doc: {
    user_name: string;
    unionImage: string;
    health_network: string;
    status: string;
  };
}
const LastActiveMobileCards = ({ doc }: LastActiveMobileCards) => {
  return (
    <Box component="div" className="card-faq">
      <div className="userInfo">
        <div className="userTitle">{doc?.user_name}</div>
        <div className="meuniImage">
          <img src={doc?.unionImage} className="menuimgStyling" />
        </div>
      </div>
      <div className="healthNetwork">
        <div className="networkName">{healthNetwork}</div>
        <div className="networkValue">{doc?.health_network}</div>
      </div>
      <div className="userStatus">
        <div className="statusTitle">{status}</div>
        <div
          className="statusValue"
          style={{ color: `${doc?.status ? "#6B7280" : "red"}` }}
        >
          {doc?.status ? "Active" : "Locked"}
        </div>
      </div>
    </Box>
  );
};

export default LastActiveMobileCards;
