import Popover from "@mui/material/Popover";
import { useNavigate } from "react-router-dom";

import { constants } from "@src/helpers/utils/constants";
import { vfseRoutes } from "@src/routes";
import { useSelectedOrganization } from "@src/store/hooks";
import "@src/components/common/presentational/profilePopOver/profilePopOver.scss";

interface VfsePopOver {
  anchorEl: Element | ((element: Element) => Element);
  setAnchorEl: React.Dispatch<
    React.SetStateAction<Element | ((element: Element) => Element)>
  >;
}
const VfsePopOver = ({ anchorEl, setAnchorEl }: VfsePopOver) => {
  const navigate = useNavigate();
  const selectedOrganization = useSelectedOrganization();
  const { organizationRoute } = constants;
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "vfse-popover" : undefined;

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      style={{ marginLeft: "5px" }}
      className="ProfilePopOver"
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      {vfseRoutes.map((route, key) => (
        <div
          className="profile-item"
          style={{ padding: "8px 8px 4px 8px", cursor: "pointer" }}
          onClick={() => {
            setAnchorEl(null);
            navigate(
              `/${organizationRoute}/${selectedOrganization?.id}${route.path}`
            );
          }}
          key={key}
        >
          {" "}
          <a style={{ textDecoration: "none" }}>{route?.name}</a>
        </div>
      ))}
    </Popover>
  );
};

export default VfsePopOver;
