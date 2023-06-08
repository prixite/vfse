import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

import "@src/views/serverErrorPage/serverErrorPage.scss";
import Logo505 from "@src/assets/images/frame505.png";
const ServerErrorPage = () => {
  const { t } = useTranslation();
  return (
    <Box component="div" className="Page505">
      <img src={Logo505} />
      <div className="Page505__content">
        <h3 className="title">{t("505 Server Error")}</h3>
        <p className="description">
          {t("Please, try again later or contact us  if the problem persists")}
        </p>
      </div>
    </Box>
  );
};

export default ServerErrorPage;
