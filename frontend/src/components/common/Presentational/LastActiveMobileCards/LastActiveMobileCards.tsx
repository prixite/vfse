import { Box } from "@mui/material";
import "@src/components/common/Presentational/LastActiveMobileCards/LastActiveMobileCards.scss";
import { localizedData } from "@src/helpers/utils/language";

const { healthNetwork, status } = localizedData().Faq;
const LastActiveMobileCards = ({doc}) => {
  return (
    <Box component="div" className="card">
      <div className="userInfo">
        <div className="userTitle">{doc?.user_name}</div>
        <div className="meuniImage"><img src={doc?.unionImage} className="menuimgStyling"/></div>
      </div>
      <div className="healthNetwork">
          <div className="networkName">{healthNetwork}</div>
          <div className="networkValue">{doc?.health_network}</div>
      </div>
      <div className="userStatus">
       <div className="statusTitle">{status}</div>
       <div className="statusValue">{doc?.status}</div>
      </div>
  </Box>
   
  );
};

export default LastActiveMobileCards;
