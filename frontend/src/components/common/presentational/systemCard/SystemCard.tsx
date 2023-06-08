import React, { useState } from "react";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  InputAdornment,
  TextField,
  Button,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import { TransitionProps } from "@mui/material/transitions";
import Typography from "@mui/material/Typography";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import Machine from "@src/assets/images/system.png";
import useStyles from "@src/components/common/presentational/systemCard/Style";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import TerminalScreenDialog from "@src/components/terminalScreen/TerminalScreenDialog";
import { SystemInterfaceProps } from "@src/helpers/interfaces/localizationinterfaces";
import { timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";
import { DeleteOrganizationSystemService } from "@src/services/systemServices";
import {
  useAppDispatch,
  useAppSelector,
  useSelectedOrganization,
} from "@src/store/hooks";
import {
  useOrganizationsSystemsDeleteMutation,
  api,
  Organization,
} from "@src/store/reducers/api";
import { openSystemDrawer } from "@src/store/reducers/appStore";

import PasswordDialog from "./vncScreen/PasswordModal";

import "../../../../../../node_modules/xterm/css/xterm.css";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SystemCard = ({
  system,
  handleEdit,
  canLeaveNotes,
  currentUser,
  onSupport,
  viewSystemLocation,
}: SystemInterfaceProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const [webSSHPayload] = api.useWebsshlogCreateMutation();
  const [consoleMsg, setConsoleMsg] = useState<string>("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorConnect, setAnchorConnect] = useState(null);
  const [modal, setModal] = useState(false);
  const [loginProgress, setLoginProgress] = useState(false);
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const selectedOrganization: Organization = useSelectedOrganization();
  const dispatch = useAppDispatch();
  const [deleteSystem] = useOrganizationsSystemsDeleteMutation();
  const [openSSHModal, setOpenSSHModal] = useState(false);
  const [openTelnetModal, setOpenTelnetModal] = useState(false);
  const [openVnc, setOpenVnc] = useState(false);

  const open = Boolean(anchorEl);
  const openConnect = Boolean(anchorConnect);

  const handleSSHModalClose = () => {
    setOpenSSHModal(false);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleConnectClick = (event) => {
    setAnchorConnect(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
    setAnchorConnect(null);
  };

  const onEdit = (e) => {
    handleEdit(system);
    handleClose(e);
  };
  const handleDelete = async () => {
    setModal(false);
    await DeleteOrganizationSystemService(
      selectedOrganization.id,
      system.id,
      deleteSystem
    );
    toast.success("System successfully deleted.", {
      autoClose: timeOut,
      pauseOnHover: false,
    });

    handleClose();
  };
  const onComment = (e) => {
    dispatch(openSystemDrawer(system?.id));
    handleClose(e);
  };

  const handleLogsOnEnter = (prev) => {
    const payload = {
      webSshLog: {
        log: prev,
        system: system.id,
      },
    };

    if (
      payload.webSshLog.log !== null &&
      payload.webSshLog.log.trim() !== "" &&
      currentUser.audit_enabled &&
      !consoleMsg.length
    ) {
      webSSHPayload({ ...payload })
        .unwrap()
        .then()
        .catch((error) => {
          toastAPIError("Incorrect command seen.", error.status, error?.data);
        });
    }
  };

  const webSSHConnection = (msg: { id: string; status: string }) => {
    if (msg.id === null) {
      toastAPIError(msg.status);
      setLoginProgress(false);
    } else {
      setLoginProgress(false);
      setOpenSSHModal(true);
      const url = `${process.env.WEBSSH_WS_SERVER}ws?id=${msg.id}`;
      const title_element: { text: string } = undefined;
      const url_opts_data: unknown = {};
      const style: { width: number; height: number } = undefined;
      const encoding = "utf-8";
      const decoder = window.TextDecoder
        ? new window.TextDecoder(encoding)
        : encoding;
      let sock = new window.WebSocket(url);
      const containerElement = document.getElementById("terminal");

      const term: Terminal = new Terminal();
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.on_resize = function (cols, rows) {
        if (cols !== this.cols || rows !== this.rows) {
          this.resize(cols, rows);
          sock.send(JSON.stringify({ resize: [cols, rows] }));
        }
      };

      term.onData(function (data) {
        const ascii_code = data.charCodeAt(0);
        if (ascii_code == 13) {
          // Enter Code 13
          setConsoleMsg((prev) => {
            handleLogsOnEnter(prev);
            return "";
          });
        } else if (ascii_code == 127) {
          // BackSpaceCode 127
          setConsoleMsg((consoleMsg) => consoleMsg.slice(0, -1));
        } else {
          setConsoleMsg((consoleMsg) => consoleMsg + data);
        }
        sock.send(JSON.stringify({ data: data }));
      });

      const read_as_text_with_encoding = (file, callback, encoding) => {
        const reader = new window.FileReader();

        if (encoding === undefined) {
          encoding = "utf-8";
        }

        reader.onload = function () {
          if (callback) {
            callback(reader.result);
          }
        };

        reader.readAsText(file, encoding);
      };
      const read_as_text_with_decoder = (file, callback, decoder) => {
        const reader = new window.FileReader();

        if (decoder === undefined) {
          decoder = new window.TextDecoder("utf-8", { fatal: true });
        }

        reader.onload = function () {
          let text;
          try {
            text = decoder.decode(reader.result);
          } finally {
            if (callback) {
              callback(text);
            }
          }
        };

        reader.readAsArrayBuffer(file);
      };
      const get_cell_size = (term) => {
        style.width =
          term._core._renderService._renderer.dimensions.actualCellWidth;
        style.height =
          term._core._renderService._renderer.dimensions.actualCellHeight;
      };
      const parse_xterm_style = () => {
        // var text = $(".xterm-helpers style").text();
        const el = document.getElementsByClassName(
          ".xterm-helpers style"
        ) as unknown as HTMLElement | null;
        if (el !== null) {
          const text = el.innerText;
          let arr = text.split("xterm-normal-char{width:");
          style.width = parseFloat(arr[1]);
          arr = text.split("div{height:");
          style.height = parseFloat(arr[1]);
        }
      };
      const current_geometry = (term) => {
        if (!style.width || !style.height) {
          try {
            get_cell_size(term);
          } catch (TypeError) {
            parse_xterm_style();
          }
        }

        const cols = window.innerWidth / style.width - 1;
        const rows = window.innerHeight / style.height;
        return { cols: cols, rows: rows };
      };

      const resize_terminal = (term) => {
        const geometry = current_geometry(term);
        term.on_resize(geometry.cols, geometry.rows);
      };

      const term_write = (text) => {
        if (term) {
          term.write(text);
          if (!term.resized) {
            resize_terminal(term);
            term.resized = true;
          }
        }
      };
      const read_file_as_text = (file, callback, decoder) => {
        if (!window.TextDecoder) {
          read_as_text_with_encoding(file, callback, decoder);
        } else {
          read_as_text_with_decoder(file, callback, decoder);
        }
      };
      sock.onopen = function () {
        term.open(containerElement);
        term.focus();
        title_element.text = "WebSSH";
        if (url_opts_data.command) {
          setTimeout(function () {
            sock.send(JSON.stringify({ data: url_opts_data.command + "\r" }));
          }, 500);
        }
      };

      sock.onmessage = function (msg) {
        read_file_as_text(msg.data, term_write, decoder);
      };
      sock.onclose = function () {
        setOpenSSHModal(false);
        term.dispose();
        sock = undefined;
      };
    }
  };

  const handleConnect = async (e, systemId: number) => {
    handleClose(e);
    setLoginProgress(true);
    const url = process.env.WEBSSH_SERVER;
    try {
      const data = new FormData();
      data.append(
        "organization_id",
        selectedOrganization?.id as unknown as string
      );
      data.append("system_id", systemId.toString());
      data.append("port", "22");
      data.append("username", "root");
      data.append("term", "xterm-256color");

      fetch(url, {
        credentials: "include",
        method: "POST",
        mode: "cors",
        body: data,
      })
        .then((res) => res.json())
        .then((res) => webSSHConnection(res));
    } catch (err) {
      setLoginProgress(false);
      toastAPIError("Could not connect.", err.status, err.data);
    }
  };

  const getTooltip = () => {
    if (!system?.is_online) {
      return "System is offline";
    }
    if (
      !(
        system?.connection_options?.service_web_browser ||
        system?.connection_options?.ssh ||
        system?.connection_options?.vfse ||
        system?.connection_options?.virtual_media_control
      )
    ) {
      return "Connection method not selected";
    }
  };

  return (
    <div className={classes.systemCard}>
      <div>
        {openTelnetModal && (
          <TerminalScreenDialog
            openModal={openTelnetModal}
            handleModalClose={() => setOpenTelnetModal(false)}
            system={system}
            protocol="telnet"
          />
        )}
      </div>
      <div>
        <Dialog
          maxWidth="lg"
          open={openSSHModal}
          onClose={handleSSHModalClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleSSHModalClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {t("SSH Terminal")}
              </Typography>
            </Toolbar>
          </AppBar>
          <List id="terminal" className={classes.terminalContainer}></List>
        </Dialog>
      </div>

      <Box className={classes.container}>
        <div className={classes.machine}>
          <p className={classes.name}>{system.name}</p>
          <img
            className={classes.image}
            src={system.image_url == "" ? Machine : system.image_url}
          />
          <div className={classes.btnSection}>
            <Tooltip title={getTooltip()}>
              <span>
                <Button
                  style={{
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                    position: "relative",
                  }}
                  className={classes.connectBtn}
                  onClick={(e) => handleConnectClick(e)}
                  disabled={
                    !(
                      system?.connection_options?.service_web_browser ||
                      system?.connection_options?.ssh ||
                      system?.connection_options?.vfse ||
                      system?.connection_options?.virtual_media_control
                    ) || !system?.is_online
                  }
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {loginProgress ? (
                    <CircularProgress
                      color="inherit"
                      className={classes.submitProgress}
                      size={22}
                    />
                  ) : (
                    <>
                      {t("Connect")}
                      <MoreVertIcon
                        sx={{
                          marginBottom: "2px",
                          position: "absolute",
                          width: "25px",
                          height: "22px",
                          right: "0px",
                        }}
                      />
                    </>
                  )}
                  <Menu
                    id="demo-positioned-menu"
                    aria-labelledby="client-options-button"
                    anchorEl={anchorConnect}
                    open={openConnect}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    onClose={handleClose}
                    sx={{
                      "& ul": {
                        minWidth: "195px",
                      },
                    }}
                  >
                    {system.connection_options.ssh && (
                      <>
                        <MenuItem onClick={(e) => handleConnect(e, system.id)}>
                          <span style={{ marginLeft: "12px" }}>SSH</span>
                        </MenuItem>
                        <MenuItem onClick={() => setOpenTelnetModal(true)}>
                          <span style={{ marginLeft: "12px" }}>Telnet</span>
                        </MenuItem>
                      </>
                    )}
                    {system.connection_options.vfse && (
                      <MenuItem onClick={() => setOpenVnc(true)}>
                        <span style={{ marginLeft: "12px" }}>Control</span>
                      </MenuItem>
                    )}
                    {system.connection_options.virtual_media_control && (
                      <MenuItem>
                        <span style={{ marginLeft: "12px" }}>
                          Virtual Media Control
                        </span>
                      </MenuItem>
                    )}
                    {system.connection_options.service_web_browser && (
                      <MenuItem
                        onClick={() =>
                          window.open(
                            `//s-${selectedOrganization.id}-${system.id}.vfse.io${system.service_page_path}`,
                            "_blank"
                          )
                        }
                      >
                        <span style={{ marginLeft: "12px" }}>
                          Service Web Browser
                        </span>
                      </MenuItem>
                    )}
                  </Menu>
                </Button>
              </span>
            </Tooltip>
            {system?.grafana_link ? (
              <Button
                variant="contained"
                className={classes.linkBtn}
                onClick={() => window?.open(system.grafana_link, "_blank")}
              >
                <div className="btn-content">
                  <AttachFileIcon className={classes.icon} />
                  <span>{t("Dashboard Link")}</span>
                </div>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className={classes.featuresSection}>
          <div className={classes.features}>
            <div className={classes.featuresOptions}>
              <p className={classes.option}>
                {t("HIS/RIS info")} <br />
                <strong
                  className={classes.titleStrong}
                  style={{ overflowWrap: "anywhere" }}
                >
                  {system.his_ris_info?.title || "-"}
                </strong>
              </p>
              <p className={classes.option}>
                {t("Dicom info")} <br />
                <strong className={classes.titleStrong}>
                  {system.dicom_info?.title || "-"}
                </strong>
              </p>
              <p className={classes.option}>
                {t("Serial")} <br />
                <strong className={classes.titleStrong}>
                  {system.serial_number || "-"}
                </strong>
              </p>
              <p className={classes.option}>
                {t("Is Online")} <br />
                <strong className={classes.titleStrong}>
                  {system.is_online ? "Yes" : "No"}
                </strong>
              </p>
            </div>
            <div>
              <p className={classes.option}>
                {t("Asset")} <br />
                <strong className={classes.titleStrong}>
                  {system.asset_number || "-"}
                </strong>
              </p>
              {system.product_model_detail?.modality?.group.toLowerCase() ===
              "mri" ? (
                <p className={classes.option}>
                  {t("Helium Level")} <br />
                  <strong className={classes.titleStrong}>
                    {system.mri_embedded_parameters?.helium || "-"}
                  </strong>
                </p>
              ) : (
                ""
              )}
              <p className={classes.option}>
                {t("MPC Status")} <br />
                <strong className={classes.titleStrong}>
                  {system.mri_embedded_parameters?.magnet_pressure || "-"}
                </strong>
              </p>
              {system.last_successful_ping_at && (
                <p className={classes.option}>
                  {t("Latest Ping")} <br />
                  <strong className={classes.titleStrong}>
                    {moment(system.last_successful_ping_at).format("l")}{" "}
                    {moment(system.last_successful_ping_at).format("LT")}
                  </strong>
                </p>
              )}
            </div>
          </div>
          {currentUser.documentation_url ? (
            <TextField
              className={classes.copyField}
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
                      className={classes.copyBtn}
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
        <div className={classes.infoSection}>
          <p className={classes.option}>
            {t("IP adress")} <br />
            <strong className={classes.titleStrong}>
              {system.ip_address || "-"}
            </strong>
          </p>
          <p className={classes.option}>
            {t("Local AE title")} <br />
            <strong className={classes.titleStrong}>
              {system.local_ae_title || "-"}
            </strong>
          </p>
          <p className={classes.option}>
            {t("Software Version")} <br />
            <strong className={classes.titleStrong}>
              {system.software_version || "-"}
            </strong>
          </p>
          <p className={classes.option}>
            {t("Location")} <br />
            <strong className={classes.titleStrong}>
              {system.location_in_building || "-"}
            </strong>
          </p>
        </div>
      </Box>
      {!currentUser?.view_only ? (
        <div>
          <MoreVertIcon
            id="client-options-button"
            className={classes.dropdown}
            onClick={handleClick}
          />
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
            onClose={handleClose}
          >
            <MenuItem onClick={() => viewSystemLocation(system)}>
              <span style={{ marginLeft: "12px" }}>View Location</span>
            </MenuItem>
            <MenuItem onClick={(e) => onSupport(e)}>
              <span style={{ marginLeft: "12px" }}>{t("Support")}</span>
            </MenuItem>
            {currentUser?.role !== "end-user" && (
              <MenuItem onClick={(e) => onEdit(e)}>
                <span style={{ marginLeft: "12px" }}>{t("Edit")}</span>
              </MenuItem>
            )}
            {canLeaveNotes && (
              <MenuItem onClick={(e) => onComment(e)}>
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
      ) : (
        ""
      )}

      <ConfirmationModal
        name={system.name}
        open={modal}
        handleClose={() => setModal(false)}
        handleDeleteOrganization={handleDelete}
      />
      {openVnc && (
        <PasswordDialog
          openModal={openVnc}
          handleModalClose={() => setOpenVnc(false)}
          handleModalOpen={() => setOpenVnc(true)}
          system={system}
          organizationId={selectedOrganization.id}
        />
      )}
    </div>
  );
};

export default SystemCard;
