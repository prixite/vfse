import React, { useState, Dispatch, SetStateAction } from "react";

import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  InputAdornment,
  TextField,
  Button,
  Menu,
  MenuItem,
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
import { toast } from "react-toastify";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";

import Machine from "@src/assets/images/system.png";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import useStyles from "@src/components/common/presentational/systemCard/Style";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { localizedData } from "@src/helpers/utils/language";
import { DeleteOrganizationSystemService } from "@src/services/systemServices";
import {
  useAppDispatch,
  useAppSelector,
  useSelectedOrganization,
} from "@src/store/hooks";
import { useOrganizationsSystemsDeleteMutation } from "@src/store/reducers/api";
import { openSystemDrawer } from "@src/store/reducers/appStore";
import { System } from "@src/store/reducers/generated";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface SystemInterfaceProps {
  system: System;
  handleEdit?: (system: System) => void;
  setSystem?: Dispatch<SetStateAction<string>>;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
}
function getCookie(cookieName) {
  const cookie = {};
  document.cookie.split(";").forEach(function (el) {
    const [key, value] = el.split("=");
    cookie[key.trim()] = value;
  });
  return cookie[cookieName];
}
const SystemCard = ({
  system,
  handleEdit,
  setSystem,
  setIsOpen,
}: SystemInterfaceProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [modal, setModal] = useState(false);
  const [loginProgress, setLoginProgress] = useState(false);
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );
  const selectedOrganization: unknown = useSelectedOrganization();
  const dispatch = useAppDispatch();
  const [deleteSystem] = useOrganizationsSystemsDeleteMutation();
  const [openModal, setOpenModal] = useState(false);

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

  const handleModalClose = () => {
    setOpenModal(false);
  };

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

  const webSSHConnection = (msg: { id: string; status: string }) => {
    if (msg.id === null) {
      toast.error(msg.status, {
        autoClose: 2000,
        pauseOnHover: true,
      });
      setLoginProgress(false);
    } else {
      setLoginProgress(false);
      setOpenModal(true);
      const url = `${process.env.WEBSSH_WS}ws?id=${msg.id}`;
      const title_element: unknown = {};
      const url_opts_data: unknown = {};
      const style: unknown = {};
      const encoding = "utf-8";
      const decoder = window.TextDecoder
        ? new window.TextDecoder(encoding)
        : encoding;
      const custom_font = document.fonts
        ? document.fonts.values().next().value
        : undefined;
      let default_fonts;
      let sock = new window.WebSocket(url);
      const containerElement = document.getElementById("terminal");
      const termOptions = {
        cursorBlink: true,
        theme: {
          background: "black",
          foreground: "white",
        },
      };
      const term: unknown = new Terminal(termOptions);
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      term.on_resize = function (cols, rows) {
        if (cols !== this.cols || rows !== this.rows) {
          this.resize(cols, rows);
          sock.send(JSON.stringify({ resize: [cols, rows] }));
        }
      };

      term.onData(function (data) {
        sock.send(JSON.stringify({ data: data }));
      });
      const custom_font_is_loaded = () => {
        if (custom_font.status === "loaded") {
          return true;
        }
        if (custom_font.status === "unloaded") {
          return false;
        }
      };
      const update_font_family = (term) => {
        if (term.font_family_updated) {
          return;
        }

        if (!default_fonts) {
          default_fonts = term.getOption("fontFamily");
        }

        if (custom_font_is_loaded()) {
          const new_fonts = custom_font.family + ", " + default_fonts;
          term.setOption("fontFamily", new_fonts);
          term.font_family_updated = true;
        }
      };

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
        update_font_family(term);
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
        term.dispose();
        term = undefined;
        sock = undefined;
      };
    }
  };

  const handleConnect = async (systemId: number) => {
    setLoginProgress(true);
    const url = process.env.WEBSSH_SERVER;
    try {
      const response = await fetch(url, {
        credentials: "include",
        method: "GET",
        mode: "cors",
      });

      if (!response.status === 200) {
        throw new Error(`Error! status: ${response.status}`);
      } else {
        const xsrfToken = getCookie("_xsrf");
        const data = new FormData();
        data.append("organization_id", selectedOrganization?.id);
        data.append("system_id", systemId);
        data.append("port", "22");
        data.append("username", "root");
        data.append("term", "xterm-256color");
        data.append("_xsrf", xsrfToken);

        fetch(url, {
          credentials: "include",
          method: "POST",
          mode: "cors",
          body: data,
        })
          .then((res) => res.json())
          .then((res) => webSSHConnection(res));
      }
    } catch (error) {
      setLoginProgress(false);
      toast.error("Could not connect.", {
        autoClose: 1000,
        pauseOnHover: false,
      });
    }
  };
  return (
    <div className={classes.systemCard}>
      <div>
        <Dialog
          maxWidth="lg"
          open={openModal}
          onClose={handleModalClose}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleModalClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                SSH Terminal
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
            <Button
              style={{
                backgroundColor: buttonBackground,
                color: buttonTextColor,
              }}
              className={classes.connectBtn}
              onClick={() => handleConnect(system.id)}
            >
              {connect}
              {loginProgress && (
                <CircularProgress
                  color="inherit"
                  className={classes.submitProgress}
                  size={22}
                />
              )}
            </Button>
            {system?.grafana_link ? (
              <Button
                variant="contained"
                className={classes.linkBtn}
                onClick={() => window?.open(system.grafana_link, "_blank")}
              >
                <div className="btn-content">
                  <AttachFileIcon className={classes.icon} />
                  <span>{grafana_link_txt}</span>
                </div>
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className={classes.featuresSection}>
          <div className={classes.features}>
            <div style={{ marginRight: "32px" }}>
              <p className={classes.option}>
                {his_ris_info_txt} <br />
                <strong className={classes.titleStrong}>
                  {system.his_ris_info?.title || "-"}
                </strong>
              </p>
              <p className={classes.option}>
                {dicom_info_txt} <br />
                <strong className={classes.titleStrong}>
                  {system.dicom_info?.title || "-"}
                </strong>
              </p>
              <p className={classes.option}>
                {serial_txt} <br />
                <strong className={classes.titleStrong}>
                  {system.serial_number || "-"}
                </strong>
              </p>
              <p className={classes.option}>
                {is_online} <br />
                <strong className={classes.titleStrong}>
                  {system.is_online ? "Yes" : "No"}
                </strong>
              </p>
            </div>
            <div>
              <p className={classes.option}>
                {asset_txt} <br />
                <strong className={classes.titleStrong}>
                  {system.asset_number || "-"}
                </strong>
              </p>
              <p className={classes.option}>
                {helium_level} <br />
                <strong className={classes.titleStrong}>
                  {system.mri_embedded_parameters?.helium || "-"}
                </strong>
              </p>
              <p className={classes.option}>
                {mpc_status} <br />
                <strong className={classes.titleStrong}>
                  {system.mri_embedded_parameters?.magnet_pressure || "-"}
                </strong>
              </p>
              {system.last_successful_ping_at && (
                <p className={classes.option}>
                  {latest_ping} <br />
                  <strong className={classes.titleStrong}>
                    {moment(system.last_successful_ping_at).format("l")}{" "}
                    {moment(system.last_successful_ping_at).format("LT")}
                  </strong>
                </p>
              )}
            </div>
          </div>
          <TextField
            className={classes.copyField}
            variant="outlined"
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
                        autoClose: 1000,
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
        </div>
        <div className={classes.infoSection}>
          <p className={classes.option}>
            {ip_address_txt} <br />
            <strong className={classes.titleStrong}>
              {system.ip_address || "-"}
            </strong>
          </p>
          <p className={classes.option}>
            {local_ae_title_txt} <br />
            <strong className={classes.titleStrong}>
              {system.local_ae_title || "-"}
            </strong>
          </p>
          <p className={classes.option}>
            {software_version_txt} <br />
            <strong className={classes.titleStrong}>
              {system.software_version || "-"}
            </strong>
          </p>
          <p className={classes.option}>
            {location} <br />
            <strong className={classes.titleStrong}>
              {system.location_in_building || "-"}
            </strong>
          </p>
        </div>
      </Box>
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
          // className="system-dropdownMenu"
          onClose={handleClose}
        >
          <MenuItem onClick={() => onSupport()}>
            <span style={{ marginLeft: "12px" }}>Support</span>
          </MenuItem>
          <MenuItem onClick={onEdit}>
            <span style={{ marginLeft: "12px" }}>Edit</span>
          </MenuItem>
          <MenuItem onClick={onComment}>
            <span style={{ marginLeft: "12px" }}>Comments</span>
          </MenuItem>
          <MenuItem onClick={() => setModal(true)}>
            <span style={{ marginLeft: "12px" }}>Delete</span>
          </MenuItem>
        </Menu>
      </div>
      <ConfirmationModal
        name={system.name}
        open={modal}
        handleClose={() => setModal(false)}
        handleDeleteOrganization={handleDelete}
      />
    </div>
  );
};

export default SystemCard;
