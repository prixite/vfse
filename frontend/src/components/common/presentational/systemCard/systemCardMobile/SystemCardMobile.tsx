import { useState } from "react";

import "@src/components/common/presentational/systemCard/systemCardMobile/systemCardMobile.scss";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  TextField,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Machine from "@src/assets/images/system.png";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
// import { SystemInterfaceProps } from "@src/helpers/interfaces/localizationinterfaces";
import { timeOut } from "@src/helpers/utils/constants";
import { DeleteOrganizationSystemService } from "@src/services/systemServices";
import {
  useAppDispatch,
  useAppSelector,
  useSelectedOrganization,
} from "@src/store/hooks";
import { useOrganizationsSystemsDeleteMutation } from "@src/store/reducers/api";
import { openSystemDrawer } from "@src/store/reducers/appStore";
import { SystemInterfaceProps } from "@src/types/interfaces";

const SystemCardMobile = ({
  system,
  handleEdit,
  canLeaveNotes,
  currentUser,
  viewSystemLocation,
  onSupport,
}: SystemInterfaceProps) => {
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state?.myTheme
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [modal, setModal] = useState(false);
  const selectedOrganization = useSelectedOrganization();
  const dispatch = useAppDispatch();
  const [deleteSystem] = useOrganizationsSystemsDeleteMutation();
  const open = Boolean(anchorEl);

  const { t } = useTranslation();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onEdit = () => {
    handleEdit(system);
    handleClose();
  };
  const handleDelete = async () => {
    setModal(false);
    await DeleteOrganizationSystemService(
      selectedOrganization.id,
      system.id,
      deleteSystem
    );
    handleClose();
  };
  const onComment = () => {
    dispatch(openSystemDrawer(system?.id));
    handleClose();
  };

  return (
    <>
      <Accordion className="SystemCardMobile">
        <AccordionSummary
          expandIcon={
            <MoreVertIcon
              style={{ fontSize: "28px" }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(e);
              }}
            />
          }
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="SystemCardMobile__summary"
        >
          <div className="header">
            <div className="thumbnail">
              <img
                className="image"
                src={system.image_url == "" ? Machine : system.image_url}
              />
            </div>
            <h3 className="title">{system.name}</h3>
          </div>
        </AccordionSummary>
        <AccordionDetails className="SystemCardMobile__details ">
          <div className="featureSection">
            <div className="option">
              <h3 className="title">{t("HIS/RIS info")}</h3>
              <h3 className="value">{system.his_ris_info?.title}</h3>
            </div>
            <div className="option">
              <h3 className="title">{t("Dicom info")}</h3>
              <h3 className="value">{system.dicom_info?.title}</h3>
            </div>
            <div className="option">
              <h3 className="title">{t("Serial")}</h3>
              <h3 className="value">{system.serial_number}</h3>
            </div>
            <div className="option">
              <h3 className="title">{t("Is Online")}</h3>
              <h3 className="value">{system.is_online ? "Yes" : "No"}</h3>
            </div>
            <div className="option">
              <h3 className="title">{t("Asset")}</h3>
              <h3 className="value">{system.asset_number}</h3>
            </div>
            <div className="option">
              <h3 className="title">{t("Helium Level")}</h3>
              <h3 className="value">
                {system.mri_embedded_parameters?.helium}
              </h3>
            </div>
            <div className="option">
              <h3 className="title">{t("MPC Status")}</h3>
              <h3 className="value">
                {system.mri_embedded_parameters?.magnet_pressure}
              </h3>
            </div>
            {system.last_successful_ping_at && (
              <div className="option">
                <h3 className="title">{t("Latest Ping")}</h3>
                <h3 className="value">
                  {moment(system.last_successful_ping_at).format("l")}{" "}
                  {moment(system.last_successful_ping_at).format("LT")}
                </h3>
              </div>
            )}
            {currentUser.documentation_url ? (
              <TextField
                className="copy-field"
                variant="outlined"
                autoComplete="off"
                value={system.documentation}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ContentCopyIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start">
                      <Button
                        className="copy-btn"
                        onClick={() => {
                          navigator?.clipboard?.writeText(system.documentation);
                          toast.success("Link Copied.", {
                            autoClose: timeOut,
                            pauseOnHover: false,
                          });
                        }}
                      >
                        {t("Copy")}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              ""
            )}
          </div>
          <div className="infoSection">
            <div className="option">
              <h3 className="title">{t("IP adress")}</h3>
              <h3 className="value">{system.ip_address}</h3>
            </div>
            <div className="option">
              <h3 className="title">{t("Local AE title")}</h3>
              <h3 className="value">{system.local_ae_title}</h3>
            </div>
            <div className="option">
              <h3 className="title"> {t("Software Version")}</h3>
              <h3 className="value">{system.software_version}</h3>
            </div>
            <div className="option">
              <h3 className="title"> {t("Location")}</h3>
              <h3 className="value">{system.location_in_building}</h3>
            </div>
          </div>
          <div className="actionSection">
            <Button
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              className="connect-btn"
            >
              <p>{t("Connect")}</p>
            </Button>
            {system?.grafana_link ? (
              <Button
                variant="contained"
                className="link-btn"
                onClick={() => window?.open(system.grafana_link, "_blank")}
              >
                <div className="btn-content">
                  <AttachFileIcon className="icon" />
                  <span>{t("Dashboard Link")}</span>
                </div>
              </Button>
            ) : (
              ""
            )}
          </div>
        </AccordionDetails>
      </Accordion>
      <div>
        <Menu
          id="demo-positioned-menu"
          aria-labelledby="client-options-button"
          anchorEl={anchorEl}
          open={open}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          className="system-dropdownMenu"
          onClose={handleClose}
        >
          <MenuItem onClick={() => viewSystemLocation(system)}>
            <span style={{ marginLeft: "12px" }}>View Location</span>
          </MenuItem>
          <MenuItem onClick={() => onSupport(system)}>
            <span style={{ marginLeft: "12px" }}>{t("Support")}</span>
          </MenuItem>
          {currentUser?.role !== "end-user" && (
            <MenuItem onClick={onEdit}>
              <span style={{ marginLeft: "12px" }}>{t("Edit")}</span>
            </MenuItem>
          )}
          {canLeaveNotes && (
            <MenuItem onClick={onComment}>
              <span style={{ marginLeft: "12px" }}>{t("Comments")}</span>
            </MenuItem>
          )}
          {currentUser?.role !== "end-user" && (
            <MenuItem onClick={() => setModal(true)}>
              <span style={{ marginLeft: "12px" }}>{t("Delete")}</span>
            </MenuItem>
          )}
        </Menu>
      </div>
      <ConfirmationModal
        name={system.name}
        open={modal}
        handleClose={() => setModal(false)}
        handleDeleteOrganization={handleDelete}
      />
    </>
  );
};

export default SystemCardMobile;
