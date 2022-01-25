import { useState, useEffect, useCallback } from "react";

import { TextField, Grid, MenuItem, FormControl, Select } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { ProductModel } from "@src/store/reducers/api";
import debounce from "debounce";
import { useProductsModelsListQuery } from "@src/store/reducers/api";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import SystemImageGallery from "@src/components/common/Smart/SystemImageGallery/SystemImageGallery";
import { localizedData } from "@src/helpers/utils/language";
import { ValidateIPaddress, isValidURL } from "@src/helpers/utils/utils";
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

interface productSearch {
  query?: string,
  results: ProductModel[]
}

export default function SystemModal(props: systemProps) {
  // const [newFields, setNewFields] = useState([1]);
  const siteData: siteProps = {};
  let product: ProductModel;
  let productState: productSearch;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [site, setSite] = useState(siteData);
  const [query, setQuery] = useState("");
  const [siteError, setSiteError] = useState("");
  const [modal, setModal] = useState(product);
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
  const [disableButton, setDisableButton] = useState(false);
  const [productList, setProductList] = useState(productState);
  const [addSystem] = useOrganizationsSystemsCreateMutation();

  const { data: productData, isFetching: fetchingProducts } = useProductsModelsListQuery();

  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  const dropdownStyles = {
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 220,
      },
    },
  };

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
      dName: fieldName,
    },
    {
      name: grafanaLink,
      setError: setLinkError,
      dName: fieldLink,
    },
    {
      name: modal,
      setError: setModalError,
      dName: fieldModal,
    },
    {
      name: version,
      setError: setVersionError,
      dName: fieldVersion,
    },
    {
      name: asset,
      setError: setAssetError,
      dName: fieldAsset,
    },
    {
      name: ip,
      setError: setIpError,
      dName: fieldIp,
    },
    {
      name: localAE,
      setError: setLocalAeError,
      dName: fieldLocalAE,
    },
    {
      name: risAE,
      setError: setRisAeError,
      dName: fieldRisAE,
    },
    {
      name: risIp,
      setError: setRisIpError,
      dName: fieldRisIp,
    },
    {
      name: risPort,
      setError: setRisPortError,
      dName: fieldRisPort,
    },
    {
      name: risTitle,
      setError: setRisTitleError,
      dName: fieldRisTitle,
    },
    {
      name: dicAE,
      setError: setDicAeError,
      dName: fieldDicomAE,
    },
    {
      name: dicIP,
      setError: setDicIpError,
      dName: fieldDicomIp,
    },
    {
      name: dicPort,
      setError: setDicPortError,
      dName: fieldDicomPort,
    },
    {
      name: dicTitle,
      setError: setDicTitleError,
      dName: fieldDicomTitle,
    },
    {
      name: mriHelium,
      setError: setMriHeliumError,
      dName: fieldMRIHelium,
    },
    {
      name: mriMagnet,
      setError: setMriMagnetError,
      dName: fieldMRIMagnet,
    },
  ];

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const resetModal = () => {
    setName("");
    setNameError("");
    setSiteError("");
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

  const handleClear = () => {
    resetModal();
    props.handleClose();
  };

  const handleIpAddress = (e) => {
    setIP(e.target.value);
    if (!ValidateIPaddress(e.target.value)) {
      setIpError("Enter valid IP address");
    } else {
      setIpError("");
    }
  };

  const handleName = (e) => {
    setName(e.target.value);
    if (!e.target.value) {
      setNameError("Name is required.");
    } else {
      setNameError("");
    }
  };

  const handleModal = (e) => {
    setModal(e.target.value);
    if (!e.target.value) {
      setModalError("Product model is required.");
    } else {
      setModalError("");
    }
  };

  const handleVerion = (e) => {
    setVersion(e.target.value);
    if (!e.target.value) {
      setVersionError("Software Version is required.");
    } else {
      setVersionError("");
    }
  };

  const handleAsset = (e) => {
    setAsset(e.target.value);
    if (!e.target.value) {
      setAssetError("Asset number is required.");
    } else {
      setAssetError("");
    }
  };

  const handleLocalAe = (e) => {
    setlocalAE(e.target.value);
    if (!e.target.value) {
      setLocalAeError("Local AE Title is required.");
    } else {
      setLocalAeError("");
    }
  };

  const handleRisTitle = (e) => {
    setRisTitle(e.target.value);
    if (!e.target.value) {
      setRisTitleError("Title is required.");
    } else {
      setRisTitleError("");
    }
  };

  const handleRisPort = (e) => {
    setRisPort(e.target.value);
    if (!e.target.value) {
      setRisPortError("Port is required.");
    } else {
      setRisPortError("");
    }
  };

  const handleRisAeTitle = (e) => {
    setRisAE(e.target.value);
    if (!e.target.value) {
      setRisAeError("AE Title is required.");
    } else {
      setRisAeError("");
    }
  };

  const handleDicTitle = (e) => {
    setDicTitle(e.target.value);
    if (!e.target.value) {
      setDicTitleError("AE Title is required.");
    } else {
      setDicTitleError("");
    }
  };

  const handleDicPort = (e) => {
    setDicPort(e.target.value);
    if (!e.target.value) {
      setDicPortError("Port is required.");
    } else {
      setDicPortError("");
    }
  };

  const handleDicAeTitle = (e) => {
    setDicAE(e.target.value);
    if (!e.target.value) {
      setDicAeError("AE Title is required.");
    } else {
      setDicAeError("");
    }
  };

  const handleMriMagnet = (e) => {
    setMriMagnet(e.target.value);
    if (!e.target.value) {
      setMriMagnetError("Magnet pressure is required.");
    } else {
      setMriMagnetError("");
    }
  };

  const handleMriHelium = (e) => {
    setMriHelium(e.target.value);
    if (!e.target.value) {
      setMriHeliumError("Magnet pressure is required.");
    } else {
      setMriHeliumError("");
    }
  };

  const handleRisIpAddress = (e) => {
    setRisIp(e.target.value);
    if (!ValidateIPaddress(e.target.value)) {
      setRisIpError("Enter valid IP address");
    } else {
      setRisIpError("");
    }
  };

  const handleDicIpAddress = (e) => {
    setDicIP(e.target.value);
    if (!ValidateIPaddress(e.target.value)) {
      setDicIpError("Enter valid IP address");
    } else {
      setDicIpError("");
    }
  };

  const handleUrl = (e) => {
    setGrafanaLink(e.target.value);
    if (!isValidURL(e.target.value)) {
      setLinkError("Enter valid url");
    } else {
      setLinkError("");
    }
  };

  const handleSearch = (e, products) => {
   setQuery(e.target.value);
   onSearch(e.target.value, products)
  };

  const isValidPostRequest = () => {
    const data = requiredStates.map((item) => {
      if (!item.name) {
        item.setError(`${item.dName} is required`);
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
      if (isValidPostRequest()) {
        setDisableButton(true);
        const systemObj = {
          name: name,
          site: site?.id,
          serial_number: serialNumber,
          location_in_building: buildingLocation,
          system_contact_info: systemContactInfo,
          grafana_link: grafanaLink,
          product_model: modal?.id,
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
          handleClear,
          setDisableButton
        );
      }
  };

  const onSearch = useCallback(
    debounce((searchQuery: string, products: ProductModel[]) => {
      if (searchQuery?.length > 1) {
        const result = products?.filter((data) => data?.name?.toLowerCase().search(searchQuery?.toLowerCase()) !=
        -1);
        const newList : productSearch = { query: searchQuery, results: result };
        setProductList(newList);
      }
    }, 500),
    []
  );

  const stopImmediatePropagation = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  };

  useEffect(() => {
    if (selectedOrganization?.sites.length) {
      setSite(selectedOrganization?.sites[0]);
    }
  }, [selectedOrganization]);

  useEffect(() => {
    if (productData?.length) {
      setModal(productData[0]);
    }
  }, [productData]);

  return (
    <Dialog className="system-modal" open={props.open} onClose={handleClear}>
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">{"Add System"}</span>
          <span className="dialog-page">
            <img src={CloseBtn} className="cross-btn" onClick={handleClear} />
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
                    onChange={handleName}
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
                      {
                        selectedOrganization?.sites.map((item, index) => (
                          <MenuItem
                            key={index}
                            value={item.name}
                            onClick={() => setSite(item)}
                          >
                            {item.name}
                          </MenuItem>
                        ))
                      }
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
                  <FormControl sx={{ minWidth: "100%" }}>
                    <Select
                      value={modal?.name}
                      displayEmpty
                      disabled={!productData?.length}
                      className="info-field"
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "48px", marginRight: "15px" }}
                      MenuProps={dropdownStyles}
                    >
                      <MenuItem
                        onKeyDown={(e) => e.stopPropagation()}
                        onClickCapture={stopImmediatePropagation}
                        style={{background: 'transparent', padding: '0'}}
                      >
                      <TextField
                          style={{width: '100%', padding: '10px'}}
                          className='search'
                          variant="outlined"
                          size="small"
                          value={query}
                          placeholder="search"
                          onChange={(e)=> handleSearch(e, productData)}
                        />
                      </MenuItem>
                      {
                        productList?.results?.length && !fetchingProducts && query?.length > 1? 
                        productList?.results?.map((item, index) => (
                          <MenuItem
                            key={index}
                            value={item.name}
                            onClick={() => setModal(item)}
                          >
                            {item.name}
                          </MenuItem>
                        ))
                        : 
                        !fetchingProducts ?
                       productData?.map((item, index) => (
                        <MenuItem
                          key={index}
                          value={item.name}
                          onClick={() => setModal(item)}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          {item.name}
                        </MenuItem>
                      ))
                      : ''
                    }
                    </Select>
                  </FormControl>
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
                    onChange={handleVerion}
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
                    placeholder="192.165.3.2"
                    onChange={handleIpAddress}
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
                    onChange={handleAsset}
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
                    onChange={handleLocalAe}
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
                <Checkbox onClick={() => setVfse(!vfse)} style={{color: vfse? buttonBackground : ''}}/>
                <span className="text">vFSE[VNC OR OTHER]</span>
              </div>
              <div className="checkBox">
                <Checkbox onClick={() => setSsh(!ssh)} style={{color: ssh? buttonBackground : ''}}/>
                <span className="text">SSH [or terminal]</span>
              </div>
              <div className="checkBox">
                <Checkbox onClick={() => setServiceWeb(!serviceWeb)} style={{color : serviceWeb? buttonBackground : ''}}/>
                <span className="text">Service web browser</span>
              </div>
              <div className="checkBox">
                <Checkbox onClick={() => setVirtualMedia(!virtualMedia)} style={{color: virtualMedia ? buttonBackground : ''}}/>
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
                    type="url"
                    placeholder="https://example.com"
                    value={grafanaLink}
                    onChange={handleUrl}
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
                      placeholder="192.165.3.2"
                      value={risIp}
                      onChange={handleRisIpAddress}
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
                      onChange={handleRisTitle}
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
                      onChange={handleRisPort}
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
                      onChange={handleRisAeTitle}
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
                        placeholder="192.165.3.2"
                        value={dicIP}
                        onChange={handleDicIpAddress}
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
                        onChange={handleDicTitle}
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
                        onChange={handleDicPort}
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
                        onChange={handleDicAeTitle}
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
                        onChange={handleMriHelium}
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
                        onChange={handleMriMagnet}
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
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          className="cancel-btn"
          style={{ backgroundColor: secondaryColor, color: buttonTextColor }}
          onClick={handleClear}
          disabled={disableButton}
        >
          {btnCancel}
        </Button>
        <Button
          className="add-btn"
          style={{ backgroundColor: buttonBackground, color: buttonTextColor }}
          onClick={handleAdd}
          disabled={disableButton}
        >
          {btnAdd}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
