import { Box } from "@mui/material";
import "@src/components/common/presentational/lastActiveMobileCards/lastActiveMobileCards.scss";
import { useTranslation } from "react-i18next";

import ThreeDots from "@src/assets/svgs/three-dots.svg";
import { User } from "@src/store/reducers/generatedWrapper";
interface LastActiveMobileCards {
  keyNumber?: number;
  doc: User;
}
const LastActiveMobileCards = ({ keyNumber, doc }: LastActiveMobileCards) => {
  const { t } = useTranslation();
  return (
    <Box component="div" className="card-faq">
      <div className="userInfo">
        <div className="userTitle">{`${doc?.first_name} ${doc?.last_name}`}</div>
        <div className="meuniImage">
          <img src={ThreeDots} className="menuimgStyling" />
        </div>
      </div>
      <div className="healthNetwork">
        <div className="networkName">{t("HEALTH NETWORK")}</div>
        <div className="networkValue">{doc?.health_networks[keyNumber]}</div>
      </div>
      <div className="userStatus">
        <div className="statusTitle">{t("STATUS")}</div>
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
