import { Box } from "@mui/material";

import "@src/components/common/presentational/lastActiveMobileCards/lastActiveMobileCards.scss";
import ThreeDots from "@src/assets/svgs/three-dots.svg";
import { localizedData } from "@src/helpers/utils/language";
import { User } from "@src/store/reducers/generated";

const { healthNetwork, status } = localizedData().Faq;

interface LastActiveMobileCards {
  key: number;
  doc: User;
}
const LastActiveMobileCards = ({ key, doc }: LastActiveMobileCards) => {
  return (
    <Box component="div" className="card-faq">
      <div className="userInfo">
        <div className="userTitle">{`${doc?.first_name} ${doc?.last_name}`}</div>
        <div className="meuniImage">
          <img src={ThreeDots} className="menuimgStyling" />
        </div>
      </div>
      <div className="healthNetwork">
        <div className="networkName">{healthNetwork}</div>
        <div className="networkValue">{doc?.health_networks[key]}</div>
      </div>
      <div className="userStatus">
        <div className="statusTitle">{status}</div>
        <div
          className="statusValue"
          style={{ color: `${doc?.is_active ? "#6B7280" : "red"}` }}
        >
          {doc?.is_active ? "Active" : "Locked"}
        </div>
      </div>
    </Box>
  );
};

export default LastActiveMobileCards;
