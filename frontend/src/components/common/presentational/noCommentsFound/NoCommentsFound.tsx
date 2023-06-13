import { useTranslation } from "react-i18next";

import noCommentsLogo from "@src/assets/images/no-messages.png";
import "@src/components/common/presentational/noCommentsFound/noCommentsFound.scss";
const NoCommentsFound = () => {
  const { t } = useTranslation();
  return (
    <div className="NoCommentsFound">
      <div className="Logo">
        <img src={noCommentsLogo} />
      </div>
      <h3 className="Heading">{t("This system has no comments")}</h3>
      <p className="description">{t("Start Sharing your thoughts")}</p>
    </div>
  );
};

export default NoCommentsFound;
