import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import "@src/views/notFoundPage/notFoundPage.scss";
import Logo404 from "@src/assets/images/frame404.png";
const NotFoundPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box component="div" className="Page404">
      <img src={Logo404} />
      <div className="Page404__content">
        <h3 className="title">{t("URL doesn't exist")}</h3>
        <p className="description">
          {t(
            "Looks like you're followed a broken link or entered a URL that doesn't exist on this site."
          )}
        </p>
        <Button className="Backbtn" onClick={() => navigate("/")}>
          {t("GO BACK")}
        </Button>
      </div>
    </Box>
  );
};

export default NotFoundPage;
