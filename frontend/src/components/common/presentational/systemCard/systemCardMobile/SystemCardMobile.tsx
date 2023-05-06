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
import { toast } from "react-toastify";

import Machine from "@src/assets/images/system.png";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { SystemInterfaceProps } from "@src/helpers/interfaces/localizationinterfaces";
import { timeOut } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import constantsData from "@src/localization/en.json";
import { DeleteOrganizationSystemService } from "@src/services/systemServices";
import {
  useAppDispatch,
  useAppSelector,
  useSelectedOrganization,
} from "@src/store/hooks";
import { useOrganizationsSystemsDeleteMutation } from "@src/store/reducers/api";
import { openSystemDrawer } from "@src/store/reducers/appStore";

const SystemCardMobile = ({
  system,
  handleEdit,
  setSystem,
  setIsOpen,
  canLeaveNotes,
  currentUser,
  viewSystemLocation,
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
  const {
    his_ris_info_txt,
    dicom_info_txt,
    serial_txt,
    is_online,
    asset_txt,
    helium_level,
    mpc_status,
    latest_ping,
    copy_btn,
    ip_address_txt,
    local_ae_title_txt,
    software_version_txt,
    location,
    connect,
    grafana_link_txt,
  } = localizedData().systems_card;
  const { toastData } = constantsData;
  const { 
    yes,
    no,
    format_LT,
    format_l,
    blank,
    edit,
    support,
    comments,
    deleteText
  } = constantsData.systemCard;
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const onSupport = () => {
    handleSupportChatBox();
    handleClose();
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
  
  const handleSupportChatBox = () => {
    setIsOpen(true);
    setSystem(system);
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
              <h3 className="title">{his_ris_info_txt}</h3>
              <h3 className="value">{system.his_ris_info?.title}</h3>
            </div>
            <div className="option">
              <h3 className="title">{dicom_info_txt}</h3>
              <h3 className="value">{system.dicom_info?.title}</h3>
            </div>
            <div className="option">
              <h3 className="title">{serial_txt}</h3>
              <h3 className="value">{system.serial_number}</h3>
            </div>
            <div className="option">
              <h3 className="title">{is_online}</h3>
              <h3 className="value">{system.is_online ? yes : no}</h3>
            </div>
            <div className="option">
              <h3 className="title">{asset_txt}</h3>
              <h3 className="value">{system.asset_number}</h3>
            </div>
            <div className="option">
              <h3 className="title">{helium_level}</h3>
              <h3 className="value">
                {system.mri_embedded_parameters?.helium}
              </h3>
            </div>
            <div className="option">
              <h3 className="title">{mpc_status}</h3>
              <h3 className="value">
                {system.mri_embedded_parameters?.magnet_pressure}
              </h3>
            </div>
            {system.last_successful_ping_at && (
              <div className="option">
                <h3 className="title">{latest_ping}</h3>
                <h3 className="value">
                  {moment(system.last_successful_ping_at).format(format_l)}{" "}
                  {moment(system.last_successful_ping_at).format(format_LT)}
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
                          toast.success(toastData.systemCardLinkCopiedSuccess, {
                            autoClose: timeOut,
                            pauseOnHover: false,
                          });
                        }}
                      >
                        {copy_btn}
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
              <h3 className="title">{ip_address_txt}</h3>
              <h3 className="value">{system.ip_address}</h3>
            </div>
            <div className="option">
              <h3 className="title">{local_ae_title_txt}</h3>
              <h3 className="value">{system.local_ae_title}</h3>
            </div>
            <div className="option">
              <h3 className="title"> {software_version_txt}</h3>
              <h3 className="value">{system.software_version}</h3>
            </div>
            <div className="option">
              <h3 className="title"> {location}</h3>
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
              <p>{connect}</p>
            </Button>
            {system?.grafana_link ? (
              <Button
                variant="contained"
                className="link-btn"
                onClick={() => window?.open(system.grafana_link, blank)}
              >
                <div className="btn-content">
                  <AttachFileIcon className="icon" />
                  <span>{grafana_link_txt}</span>
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
          <MenuItem onClick={() => onSupport()}>
            <span style={{ marginLeft: "12px" }}>{support}</span>
          </MenuItem>
          {currentUser?.role !== "end-user" && (
            <MenuItem onClick={onEdit}>
              <span style={{ marginLeft: "12px" }}>{edit}</span>
            </MenuItem>
          )}
          {canLeaveNotes && (
            <MenuItem onClick={onComment}>
              <span style={{ marginLeft: "12px" }}>{comments}</span>
            </MenuItem>
          )}
          {currentUser?.role !== "end-user" && (
            <MenuItem onClick={() => setModal(true)}>
              <span style={{ marginLeft: "12px" }}>{deleteText}</span>
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
