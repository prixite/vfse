import { useState, useEffect } from "react";

import { TextField, Grid, MenuItem, FormControl, Select } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import SystemImageGallery from "@src/components/common/Smart/SystemImageGallery/SystemImageGallery";
import { localizedData } from "@src/helpers/utils/language";
import { addNewOrdanizationSystem } from "@src/services/systemServices";
import { useAppSelector } from "@src/store/hooks";
import { useOrganizationsSystemsCreateMutation } from "@src/store/reducers/api";
import "@src/components/shared/popUps/SystemModal/SystemModal.scss";

interface systemProps {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
}
interface siteProps {
  name?: string;
  id?: number;
}

export default function SystemModal(props: systemProps) {
  // const [newFields, setNewFields] = useState([1]);
  const siteData: siteProps = {};
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [site, setSite] = useState(siteData);
  const [siteError, setSiteError] = useState("");
  const [modal, setModal] = useState("");
  const [modalError, setModalError] = useState("");
  const [version, setVersion] = useState("");
  const [versionError, setVersionError] = useState("");
  const [ip, setIP] = useState("");
  const [ipError, setIpError] = useState("");
  const [asset, setAsset] = useState("");
  const [assetError, setAssetError] = useState("");
  const [localAE, setlocalAE] = useState("");
  const [localAeError, setLocalAeError] = useState("");
  const [buildingLocation, setBuildingLocation] = useState("");
  const [grafanaLink, setGrafanaLink] = useState("");
  const [linkError, setLinkError] = useState("");
  const [systemContactInfo, setSystemContactInfo] = useState("");
  const [systemImage, setSystemImage] = useState(0);
  const [serialNumber, setSerialNumber] = useState("");
  const [risIp, setRisIp] = useState("");
  const [risIpError, setRisIpError] = useState("");
  const [risTitle, setRisTitle] = useState("");
  const [risTitleError, setRisTitleError] = useState("");
  const [risPort, setRisPort] = useState("");
  const [risPortError, setRisPortError] = useState("");
  const [risAE, setRisAE] = useState("");
  const [risAeError, setRisAeError] = useState("");
  const [dicIP, setDicIP] = useState("");
  const [dicIpError, setDicIpError] = useState("");
  const [dicTitle, setDicTitle] = useState("");
  const [dicTitleError, setDicTitleError] = useState("");
  const [dicPort, setDicPort] = useState("");
  const [dicPortError, setDicPortError] = useState("");
  const [dicAE, setDicAE] = useState("");
  const [dicAeError, setDicAeError] = useState("");
  const [mriHelium, setMriHelium] = useState("");
  const [mriHeliumError, setMriHeliumError] = useState("");
  const [mriMagnet, setMriMagnet] = useState("");
  const [mriMagnetError, setMriMagnetError] = useState("");
  const [vfse, setVfse] = useState(false);
  const [ssh, setSsh] = useState(false);
  const [serviceWeb, setServiceWeb] = useState(false);
  const [virtualMedia, setVirtualMedia] = useState(false);
  const [addSystem] = useOrganizationsSystemsCreateMutation();

  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const {
    fieldName,
    fieldLocation,
    fieldLink,
    fieldNumber,
    fieldSite,
    fieldModal,
    fieldVersion,
    fieldIp,
    fieldAsset,
    fieldLocalAE,
    fieldRisName,
    fieldRisIp,
    fieldRisTitle,
    fieldRisPort,
    fieldRisAE,
    fieldDicomName,
    fieldDicomIp,
    fieldDicomTitle,
    fieldDicomPort,
    fieldDicomAE,
    fieldMRIname,
    fieldMRIHelium,
    fieldMRIMagnet,
    btnAdd,
    btnCancel,
  } = localizedData().systemModal;

  const requiredStates = [
    {
      name: name,
      setError: setNameError,
    },
    {
      name: grafanaLink,
      setError: setLinkError,
    },
    {
      name: modal,
      setError: setModalError,
    },
    {
      name: version,
      setError: setVersionError,
    },
    {
      name: asset,
      setError: setAssetError,
    },
    {
      name: ip,
      setError: setIpError,
    },
    {
      name: localAE,
      setError: setLocalAeError,
    },
    {
      name: risAE,
      setError: setRisAeError,
    },
    {
      name: risIp,
      setError: setRisIpError,
    },
    {
      name: risPort,
      setError: setRisPortError,
    },
    {
      name: risTitle,
      setError: setRisTitleError,
    },
    {
      name: dicAE,
      setError: setDicAeError,
    },
    {
      name: dicIP,
      setError: setDicIpError,
    },
    {
      name: dicPort,
      setError: setDicPortError,
    },
    {
      name: dicTitle,
      setError: setDicTitleError,
    },
    {
      name: mriHelium,
      setError: setMriHeliumError,
    },
    {
      name: mriMagnet,
      setError: setMriMagnetError,
    },
  ];

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const resetModal = () => {
    setName("");
    setNameError("");
    setSiteError("");
    setModal("");
    setModalError("");
    setVersion("");
    setVersionError("");
    setIP("");
    setIpError("");
    setAsset("");
    setAssetError("");
    setlocalAE("");
    setLocalAeError("");
    setBuildingLocation("");
    setGrafanaLink("");
    setLinkError("");
    setSystemContactInfo("");
    setSystemImage(0);
    setSerialNumber("");
    setRisIp("");
    setRisIpError("");
    setRisTitle("");
    setRisTitleError("");
    setRisPort("");
    setRisPortError("");
    setRisAE("");
    setRisAeError("");
    setDicIP("");
    setDicIpError("");
    setDicTitle("");
    setDicTitleError("");
    setDicPort("");
    setDicPortError("");
    setDicAE("");
    setDicAeError("");
    setMriHelium("");
    setMriHeliumError("");
    setMriMagnet("");
    setMriMagnetError("");
    setVfse(false);
    setSsh(false);
    setServiceWeb(false);
    setVirtualMedia(false);
  };

  const isValidPostRequest = () => {
    const data = requiredStates.map((item) => {
      if (!item.name) {
        item.setError("this field is required");
        return false;
      }
    });
    if (data.includes(false)) {
      return false;
    } else {
      return true;
    }
  };

  const setErrors = (data) => {
    if (data?.name) {
      setNameError(data?.name[0]);
    }
    if (data?.site) {
      setSiteError(data.site[0]);
    }
    if (data?.grafana_link) {
      setLinkError(data.grafana_link[0]);
    }
    if (data?.product_model) {
      setModalError(data?.product_model[0]);
    }
    if (data?.software_version) {
      setVersionError(data?.software_version[0]);
    }
    if (data?.asset_number) {
      setAssetError(data.asset_number[0]);
    }
    if (data?.ip_address) {
      setIpError(data.ip_address[0]);
    }
    if (data?.local_ae_title) {
      setLocalAeError(data?.local_ae_title[0]);
    }
    if (data.his_ris_info) {
      if (data?.his_ris_info?.ip) {
        setRisIpError(data?.his_ris_info?.ip[0]);
      }
    }
    if (data.dicom_info) {
      if (data?.dicom_info?.ip) {
        setDicIpError(data?.dicom_info?.ip[0]);
      }
    }
  };

  const handleAdd = async () => {
    if (!selectedOrganization?.sites.length) {
      toast.success("Can not create system as this organization has no sites", {
        autoClose: 5000,
        pauseOnHover: false,
      });
    } else {
      if (isValidPostRequest()) {
        const systemObj = {
          name: name,
          site: site?.id,
          serial_number: serialNumber,
          location_in_building: buildingLocation,
          system_contact_info: systemContactInfo,
          grafana_link: grafanaLink,
          product_model: modal,
          image: systemImage,
          software_version: version,
          asset_number: asset,
          ip_address: ip,
          local_ae_title: localAE,
          his_ris_info: {
            ip: risIp,
            title: risTitle,
            port: risPort,
            ae_title: risAE,
          },
          dicom_info: {
            ip: dicIP,
            title: dicTitle,
            port: dicPort,
            ae_title: dicAE,
          },
          mri_embedded_parameters: {
            helium: mriHelium,
            magnet_pressure: mriMagnet,
          },
          connection_options: {
            virtual_media_control: virtualMedia,
            service_web_browser: serviceWeb,
            ssh: ssh,
          },
        };
        await addNewOrdanizationSystem(
          selectedOrganization.id,
          systemObj,
          addSystem,
          props.refetch,
          setErrors,
          resetModal
        );
      }
    }
  };

  useEffect(() => {
    if (selectedOrganization?.sites.length) {
      setSite(selectedOrganization?.sites[0]);
    }
  }, [selectedOrganization]);

  return (
    <Dialog
      className="system-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">{"Add System"}</span>
          <span className="dialog-page">
            <img
              src={CloseBtn}
              className="cross-btn"
              onClick={props.handleClose}
            />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          <p className="gallery-title">Select Image</p>
          <SystemImageGallery setSystemImage={setSystemImage} />
          <div className="client-info">
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldName}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    value={name}
                    placeholder=""
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  {nameError ? <p className="errorText">{nameError}</p> : ""}
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldSite}</p>
                  <FormControl sx={{ minWidth: "100%" }}>
                    <Select
                      value={site?.name}
                      displayEmpty
                      disabled={!selectedOrganization?.sites?.length}
                      className="info-field"
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "48px", marginRight: "15px" }}
                    >
                      {selectedOrganization?.sites.map((item, index) => (
                        <MenuItem
                          key={index}
                          value={item.name}
                          onClick={() => setSite(item)}
                        >
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {siteError ? <p className="errorText">{siteError}</p> : ""}
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldNumber}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    value={serialNumber}
                    placeholder=""
                    onChange={(e) => {
                      setSerialNumber(e.target.value);
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldLocation}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    value={buildingLocation}
                    placeholder=""
                    onChange={(e) => {
                      setBuildingLocation(e.target.value);
                    }}
                  />
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldModal}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    value={modal}
                    placeholder=""
                    onChange={(e) => {
                      setModal(e.target.value);
                    }}
                  />
                  {modalError ? <p className="errorText">{modalError}</p> : ""}
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldVersion}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    value={version}
                    placeholder=""
                    onChange={(e) => {
                      setVersion(e.target.value);
                    }}
                  />
                  {versionError ? (
                    <p className="errorText">{versionError}</p>
                  ) : (
                    ""
                  )}
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldIp}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    value={ip}
                    placeholder=""
                    onChange={(e) => {
                      setIP(e.target.value);
                    }}
                  />
                  {ipError ? <p className="errorText">{ipError}</p> : ""}
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldAsset}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    value={asset}
                    placeholder=""
                    onChange={(e) => {
                      setAsset(e.target.value);
                    }}
                  />
                  {assetError ? <p className="errorText">{assetError}</p> : ""}
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="info-section">
                  <p className="info-label">{fieldLocalAE}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    value={localAE}
                    placeholder=""
                    onChange={(e) => {
                      setlocalAE(e.target.value);
                    }}
                  />
                  {localAeError ? (
                    <p className="errorText">{localAeError}</p>
                  ) : (
                    ""
                  )}
                </div>
              </Grid>
            </Grid>
            <div className="checkbox-container">
              <div className="checkBox">
                <Checkbox onClick={() => setVfse(!vfse)} />
                <span className="text">vFSE[VNC OR OTHER]</span>
              </div>
              <div className="checkBox">
                <Checkbox onClick={() => setSsh(!ssh)} />
                <span className="text">SSH [or terminal]</span>
              </div>
              <div className="checkBox">
                <Checkbox onClick={() => setServiceWeb(!serviceWeb)} />
                <span className="text">Service web browser</span>
              </div>
              <div className="checkBox">
                <Checkbox onClick={() => setVirtualMedia(!virtualMedia)} />
                <span className="text">Virtual media control</span>
              </div>
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">{"System contact info"}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder=""
                    value={systemContactInfo}
                    onChange={(e) => {
                      setSystemContactInfo(e.target.value);
                    }}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: "5px" }}>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">{fieldLink}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder=""
                    value={grafanaLink}
                    onChange={(e) => {
                      setGrafanaLink(e.target.value);
                    }}
                  />
                  {linkError ? <p className="errorText">{linkError}</p> : ""}
                </div>
              </Grid>
            </Grid>
            <div className="box-heading">
              <p className="heading">{fieldRisName}</p>
              <div className="box">
                <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                  <Grid item xs={6}>
                    <p className="info-label">{fieldRisIp}</p>
                    <TextField
                      className="info-field"
                      variant="outlined"
                      size="small"
                      placeholder=""
                      value={risIp}
                      onChange={(e) => {
                        setRisIp(e.target.value);
                      }}
                    />
                    {risIpError ? (
                      <p className="errorText">{risIpError}</p>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <p className="info-label">{fieldRisTitle}</p>
                    <TextField
                      className="info-field"
                      variant="outlined"
                      size="small"
                      placeholder=""
                      value={risTitle}
                      onChange={(e) => {
                        setRisTitle(e.target.value);
                      }}
                    />
                    {risTitleError ? (
                      <p className="errorText">{risTitleError}</p>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <p className="info-label">{fieldRisPort}</p>
                    <TextField
                      className="info-field"
                      variant="outlined"
                      placeholder=""
                      size="small"
                      type="number"
                      value={risPort}
                      onChange={(e) => {
                        setRisPort(e.target.value);
                      }}
                    />
                    {risPortError ? (
                      <p className="errorText">{risPortError}</p>
                    ) : (
                      ""
                    )}
                  </Grid>
                  <Grid item xs={6}>
                    <p className="info-label">{fieldRisAE}</p>
                    <TextField
                      className="info-field"
                      variant="outlined"
                      size="small"
                      placeholder=""
                      value={risAE}
                      onChange={(e) => {
                        setRisAE(e.target.value);
                      }}
                    />
                    {risAeError ? (
                      <p className="errorText">{risAeError}</p>
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>
              </div>
              <div className="box-heading">
                <p className="heading">{fieldDicomName}</p>
                <div className="box">
                  <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldDicomIp}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        placeholder=""
                        value={dicIP}
                        onChange={(e) => {
                          setDicIP(e.target.value);
                        }}
                      />
                      {dicIpError ? (
                        <p className="errorText">{dicIpError}</p>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldDicomTitle}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        placeholder=""
                        value={dicTitle}
                        onChange={(e) => {
                          setDicTitle(e.target.value);
                        }}
                      />
                      {dicTitleError ? (
                        <p className="errorText">{dicTitleError}</p>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldDicomPort}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        placeholder=""
                        size="small"
                        value={dicPort}
                        type="number"
                        onChange={(e) => {
                          setDicPort(e.target.value);
                        }}
                      />
                      {dicPortError ? (
                        <p className="errorText">{dicPortError}</p>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldDicomAE}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        value={dicAE}
                        placeholder=""
                        onChange={(e) => {
                          setDicAE(e.target.value);
                        }}
                      />
                      {dicAeError ? (
                        <p className="errorText">{dicAeError}</p>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                </div>
              </div>
              <div className="box-heading">
                <p className="heading">{fieldMRIname}</p>
                <div className="box">
                  <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldMRIHelium}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        placeholder=""
                        value={mriHelium}
                        onChange={(e) => {
                          setMriHelium(e.target.value);
                        }}
                      />
                      {mriHeliumError ? (
                        <p className="errorText">{mriHeliumError}</p>
                      ) : (
                        ""
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <p className="info-label">{fieldMRIMagnet}</p>
                      <TextField
                        className="info-field"
                        variant="outlined"
                        size="small"
                        placeholder=""
                        value={mriMagnet}
                        onChange={(e) => {
                          setMriMagnet(e.target.value);
                        }}
                      />
                      {mriMagnetError ? (
                        <p className="errorText">{mriMagnetError}</p>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                </div>
              </div>
              {/* <div className="add-container" onClick={handleAdd}>
                <div className="add-btn">
                  <img src={AddIcon} />
                </div>
                <span className="text">{headdingAddInfo}</span>
              </div> */}
              {/* {newFields.map((newFields) => (
                <div
                  className="info-section"
                  key={newFields}
                  style={{ width: "356px", marginTop: "22px" }}
                >
                  <p className="info-label">Name this field</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    type="number"
                    size="small"
                    placeholder=""
                  />
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className="cancel-btn"
          style={{ backgroundColor: secondaryColor, color: buttonTextColor }}
        >
          {btnCancel}
        </Button>
        <Button
          className="add-btn"
          style={{ backgroundColor: buttonBackground, color: buttonTextColor }}
          onClick={handleAdd}
        >
          {btnAdd}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
