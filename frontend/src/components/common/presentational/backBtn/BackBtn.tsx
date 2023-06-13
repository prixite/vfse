import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { constants } from "@src/helpers/utils/constants";
const { organizationRoute } = constants;
import { vfseRoutes } from "@src/routes";
import { useSelectedOrganization } from "@src/store/hooks";
import "@src/components/common/presentational/backBtn/backBtn.scss";

const BackBtn = () => {
  const selectedOrganization = useSelectedOrganization();
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="back-btn">
      <div
        className="back-btn-container"
        onClick={() =>
          navigate(
            `/${organizationRoute}/${selectedOrganization?.id}${vfseRoutes[0].path}`
          )
        }
      >
        <ArrowRightAltIcon
          style={{ transform: "rotate(180deg)", color: "rgb(0, 0, 0)" }}
        />
        <p className="back-text">{t("Back to all")}</p>
      </div>
    </div>
  );
};

export default BackBtn;
