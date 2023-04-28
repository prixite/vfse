import { useState, useEffect, useMemo } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  TextField,
  Grid,
  MenuItem,
  FormControl,
  Select,
  FormHelperText,
} from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import SystemImageGallery from "@src/components/common/smart/systemImageGallery/SystemImageGallery";
import AddManufacturerModal from "@src/components/shared/popUps/addManufacturerModal/AddManufacturerModal";
import AddProductModelDialog from "@src/components/shared/popUps/addProductModelDialog/AddProductModelDialog";
import ProductModal from "@src/components/shared/popUps/productModal/productModal";
import FormikAutoComplete from "@src/components/shared/popUps/systemModal/FormikAutoComplete";
import { FormState } from "@src/components/shared/popUps/systemModalInterfaces/interfaces";
import { localizedData } from "@src/helpers/utils/language";
import { toastAPIError } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import {
  System,
  useProductsModelsListQuery,
  useOrganizationsSystemsCreateMutation,
  useOrganizationsSystemsPartialUpdateMutation,
  useOrganizationsReadQuery,
  useOrganizationsModalitiesListQuery,
  useModalitiesManufacturersListQuery,
  useProductsListQuery,
  useOrganizationsAssociatedSitesListQuery,
} from "@src/store/reducers/api";

import "@src/components/shared/popUps/systemModal/systemModal.scss";

const FAKE_PASSWORD_PLACEHOLDER = "fake";

interface SystemProps {
  open: boolean;
  handleClose: () => void;
  system?: System;
  setSystem?: (arg: object) => void;
}

const initialState: FormState = {
  systemImage: 0,
  modality: "",
  manufacturer: "",
  product: "",
  model: "",
  site: "",
  name: "",
  serialNumber: "",
  buildingLocation: "",
  version: "",
  ip: "",
  asset: "",
  localAE: "",
  connection: {
    vfse: false,
    ssh: false,
    web: false,
    virtual: false,
  },
  sshUser: "",
  sshPassword: "",
  telnetUser: "",
  telnetPassword: "",
  contactInfo: "",
  grafana: "",
  ris: {
    ip: "",
    title: "",
    port: null,
    ae: "",
  },
  dicom: {
    ip: "",
    title: "",
    port: null,
    ae: "",
  },
  mri: {
    helium: "",
    magnet: "",
  },
};

const validationSchema = yup.object({
  systemImage: yup
    .string()
    .required(constantsData.systemModal.popUp.imageRequired),
  modality: yup
    .string()
    .required(constantsData.systemModal.popUp.modalityRequired),
  manufacturer: yup
    .string()
    .required(constantsData.systemModal.popUp.manufacturerRequired),
  product: yup
    .string()
    .required(constantsData.systemModal.popUp.productRequired),
  model: yup.string().required(constantsData.systemModal.popUp.modelRequired),
  name: yup.string().required(constantsData.systemModal.popUp.nameRequired),
  site: yup.string().required(constantsData.systemModal.popUp.siteRequired),
  grafana: yup.string().url().nullable(),
});

const getPayload = (values: FormState): System => {
  const {
    systemImage: image,
    model,
    name,
    site,
    serialNumber: serial_number,
    buildingLocation: location_in_building,
    version: software_version,
    ip: ip_address,
    asset: asset_number,
    localAE: local_ae_title,
    connection,
    contactInfo: system_contact_info,
    grafana: grafana_link,
    ris,
    dicom,
    mri,
    sshUser,
    sshPassword,
    telnetUser,
  } = values;
  return {
    image,
    product_model: parseInt(model),
    name,
    site: parseInt(site),
    serial_number,
    location_in_building,
    software_version,
    ip_address,
    asset_number,
    local_ae_title,
    connection_options: {
      vfse: connection.vfse,
      virtual_media_control: connection.virtual,
      service_web_browser: connection.web,
      ssh: connection.ssh,
    },
    system_contact_info,
    grafana_link,
    his_ris_info: {
      ip: ris.ip,
      title: ris.title,
      port: ris.port,
      ae_title: ris.ae,
    },
    dicom_info: {
      ip: dicom.ip,
      title: dicom.title,
      port: dicom.port,
      ae_title: dicom.ae,
    },
    mri_embedded_parameters: {
      helium: mri.helium,
      magnet_pressure: mri.magnet,
    },
    ssh_user: sshUser,
    ssh_password: sshPassword === FAKE_PASSWORD_PLACEHOLDER ? "" : sshPassword,
    telnet_username: telnetUser,
  };
};

export default function SystemModal(props: SystemProps) {
  const [disableButton, setDisableButton] = useState(false);
  const [sites, setSites] = useState([]);
  const {
    mriText,
    siteText,
    selectImage,
    systemImageText,
    vFSE,
    ssh,
    serviceWebBrowser,
    virtualMediaControl,
    systemContactInfo,
  } = constantsData.systemModal.popUp;
  const { toastData } = constantsData;
  const [openManufacturerModal, setOpenManufacturerModal] = useState(false);
  const [openProductModal, setOpenProductModal] = useState(false);
  const [openAddProductModelDialog, setOpenAddProductModelDialog] =
    useState(false);

  const selectedOrganization = useSelectedOrganization();
  const [addSystem] = useOrganizationsSystemsCreateMutation();
  const [updateSystem] = useOrganizationsSystemsPartialUpdateMutation();

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setDisableButton(true);

      const upsert = props.system?.id
        ? ({ id, system }) =>
            updateSystem({ id, system, systemPk: props.system.id.toString() })
        : addSystem;

      try {
        await upsert({
          id: selectedOrganization.id.toString(),
          system: getPayload(values),
        }).unwrap();
        toast.success(toastData.systemSaveSuccess);
      } catch (error) {
        setDisableButton(false);
        toastAPIError(toastData.systemSaveError, error.status, error.data);
      } finally {
        handleClear();
      }
    },
    enableReinitialize: true,
  });

  const { data: modalityData = [], isLoading: isModalityLoading } =
    useOrganizationsModalitiesListQuery(
      {
        id: selectedOrganization.id.toString(),
      },
      { skip: !selectedOrganization }
    );

  const { data: allSites = [], isLoading: isAllSitesLoading } =
    useOrganizationsAssociatedSitesListQuery(
      {
        id: selectedOrganization.id.toString(),
      },
      { skip: !selectedOrganization }
    );

  const { data: manufacturerData = [], isFetching: isManufacturerLoading } =
    useModalitiesManufacturersListQuery(
      {
        id: formik.values.modality,
      },
      {
        skip: !formik.values.modality,
      }
    );

  const { data: productData = [], isFetching: isProductLoading } =
    useProductsListQuery(
      {
        manufacturer: parseInt(formik.values.manufacturer),
      },
      {
        skip: !formik.values.manufacturer,
      }
    );

  const { data: productModelData = [], isLoading: isProductsModelsLoading } =
    useProductsModelsListQuery(
      {
        modality: parseInt(formik.values.modality),
        product: parseInt(formik.values.product),
      },
      {
        skip: !formik.values.product || !formik.values.modality,
      }
    );

  const { siteId, networkId, id } = useParams<{
    siteId: string;
    networkId: string;
    id: string;
  }>();

  const selectedID = networkId || id;
  const { data: healthNetwork } = useOrganizationsReadQuery(
    {
      id: selectedID,
    },
    {
      skip: !selectedID,
    }
  );

  const isMri = useMemo(
    () =>
      Boolean(
        modalityData.find(
          (value) =>
            value.group === mriText &&
            value.id === parseInt(formik.values.modality)
        )
      ),
    [modalityData.length, formik.values.modality]
  );

  const isShowRis = useMemo(
    () =>
      Boolean(
        modalityData.find(
          (value) =>
            value.show_ris === true &&
            value.id === parseInt(formik.values.modality)
        )
      ),
    [modalityData.length, formik.values.modality]
  );
  const isDiscom = useMemo(
    () =>
      Boolean(
        modalityData.find(
          (value) =>
            value.show_dicom === true &&
            value.id === parseInt(formik.values.modality)
        )
      ),
    [modalityData.length, formik.values.modality]
  );

  const {
    fieldName,
    fieldManufacturer,
    fieldModality,
    fieldProduct,
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
    btnEdit,
  } = localizedData().systemModal;

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const handleClear = () => {
    //resetModal();
    props.handleClose();
    props.setSystem(null);
    formik.resetForm();
  };

  useEffect(() => {
    if (props.system) {
      formik.setValues({
        systemImage: props.system.image,
        modality: props.system.product_model_detail.modality.id.toString(),
        manufacturer:
          props.system.product_model_detail.product.manufacturer.id.toString(),
        product: props.system.product_model_detail.product.id.toString(),
        model: props.system.product_model_detail.id.toString(),
        name: props.system.name,
        site: props.system.site.toString(),
        serialNumber: props.system.serial_number,
        buildingLocation: props.system.location_in_building,
        version: props.system.software_version,
        ip: props.system.ip_address,
        asset: props.system.asset_number,
        localAE: props.system.local_ae_title,
        connection: {
          vfse: props.system.connection_options.vfse,
          virtual: props.system.connection_options.virtual_media_control,
          web: props.system.connection_options.service_web_browser,
          ssh: props.system.connection_options.ssh,
        },
        sshUser: props.system.ssh_user,
        sshPassword: FAKE_PASSWORD_PLACEHOLDER,
        telnetUser: props.system.telnet_username,
        telnetPassword: "",
        contactInfo: props.system.system_contact_info,
        grafana: props.system.grafana_link,
        ris: {
          ip: props.system.his_ris_info.ip,
          title: props.system.his_ris_info.title,
          port: props.system.his_ris_info.port,
          ae: props.system.his_ris_info.ae_title,
        },
        dicom: {
          ip: props.system.dicom_info.ip,
          title: props.system.dicom_info.title,
          port: props.system.dicom_info.port,
          ae: props.system.dicom_info.ae_title,
        },
        mri: {
          helium: props.system.mri_embedded_parameters.helium,
          magnet: props.system.mri_embedded_parameters.magnet_pressure,
        },
      });
    }
  }, [props.system]);

  useEffect(() => {
    if (siteId && healthNetwork) {
      // Coming through health network
      setSites(
        healthNetwork.sites.filter((value) => value.id === parseInt(siteId))
      );
    } else if (siteId) {
      // Coming through direct site
      setSites(
        selectedOrganization.sites.filter(
          (value) => value.id === parseInt(siteId)
        )
      );
    } else {
      // Coming through modality page
      setSites(allSites);
    }
  }, [siteId, healthNetwork, selectedOrganization, isAllSitesLoading]);

  useEffect(() => {
    if (sites.length && !props.system) {
      formik.setFieldValue(siteText, sites[0].id);
    }
  }, [sites.length, Boolean(props.system)]);

  return (
    <Dialog className="system-modal" open={props.open} onClose={handleClear}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">
            {props.system ? "Edit System" : "Add System"}
          </span>
          <span className="dialog-page">
            <img src={CloseBtn} className="cross-btn" onClick={handleClear} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          <p className="gallery-title required">{selectImage}</p>
          <SystemImageGallery
            setSystemImage={(value) =>
              formik.setFieldValue(systemImageText, value)
            }
            systemImage={formik.values.systemImage}
          />
          <div className="client-info">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label required">{fieldModality}</p>
                  <FormikAutoComplete
                    isLoading={isModalityLoading}
                    options={modalityData}
                    field="modality"
                    formik={formik}
                    placeholder="Select Modality"
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label required">{fieldManufacturer}</p>
                  <FormikAutoComplete
                    isLoading={isManufacturerLoading}
                    options={manufacturerData}
                    field="manufacturer"
                    formik={formik}
                    placeholder="Select Manufacturer"
                    parent="modality"
                  />
                  {formik.values.modality ? (
                    <div
                      className="modal-btn-styling"
                      onClick={() => setOpenManufacturerModal(true)}
                    >
                      <span>Add manufacturer</span>
                      <AddCircleIcon
                        style={{ marginLeft: "5px", color: buttonBackground }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label required">{fieldProduct}</p>
                  <FormikAutoComplete
                    isLoading={isProductLoading}
                    options={productData}
                    field="product"
                    formik={formik}
                    placeholder="Select Product"
                    parent="manufacturer"
                  />
                  {formik.values.manufacturer ? (
                    <div
                      className="modal-btn-styling"
                      onClick={() => setOpenProductModal(true)}
                    >
                      <span>Add Product</span>
                      <AddCircleIcon
                        style={{ marginLeft: "5px", color: buttonBackground }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label required">{fieldModal}</p>
                  <FormikAutoComplete
                    isLoading={isProductsModelsLoading}
                    options={productModelData}
                    field="model"
                    formik={formik}
                    placeholder="Select Model"
                    parent="product"
                    optionLabel="model"
                  />
                  {formik.values.product ? (
                    <div
                      className="modal-btn-styling"
                      onClick={() => setOpenAddProductModelDialog(true)}
                    >
                      <span>Add Product Model</span>
                      <AddCircleIcon
                        style={{ marginLeft: "5px", color: buttonBackground }}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label required">{fieldName}</p>
                  <TextField
                    autoComplete="off"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    name="name"
                    placeholder="System1"
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={
                      formik.touched.name &&
                      formik.errors.name && (
                        <span style={{ marginLeft: "-13px" }}>
                          {formik.errors.name}
                        </span>
                      )
                    }
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label required">{fieldSite}</p>
                  <FormControl
                    sx={{ minWidth: "100%" }}
                    error={formik.touched.site && Boolean(formik.errors.site)}
                  >
                    <Select
                      name="site"
                      displayEmpty
                      className="info-field"
                      placeholder="Select site"
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "48px", marginRight: "15px" }}
                      value={formik.values.site}
                      onChange={formik.handleChange}
                    >
                      {sites.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.site && Boolean(formik.errors.site) && (
                      <FormHelperText>{formik.errors.site}</FormHelperText>
                    )}
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label">{fieldNumber}</p>
                  <TextField
                    autoComplete="off"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    name="serialNumber"
                    value={formik.values.serialNumber}
                    placeholder="9xuiua002"
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label">{fieldLocation}</p>
                  <TextField
                    autoComplete="off"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    name="buildingLocation"
                    value={formik.values.buildingLocation}
                    placeholder="3161 Cunningham Avenue Suite 905"
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label">{fieldVersion}</p>
                  <TextField
                    autoComplete="off"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    name="version"
                    value={formik.values.version}
                    placeholder="v2.7"
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label">{fieldIp}</p>
                  <TextField
                    autoComplete="off"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    name="ip"
                    value={formik.values.ip}
                    placeholder="192.165.3.2"
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label">{fieldAsset}</p>
                  <TextField
                    autoComplete="off"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    name="asset"
                    value={formik.values.asset}
                    placeholder="Wm90d47P84"
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <div className="info-section">
                  <p className="info-label">{fieldLocalAE}</p>
                  <TextField
                    autoComplete="off"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    name="localAE"
                    value={formik.values.localAE}
                    placeholder="HS1"
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container className="checkbox-container">
              <Grid item xs={12} md={4} lg={4} className="checkBox">
                <Checkbox
                  name="connection.vfse"
                  onClick={formik.handleChange}
                  style={{
                    color: formik.values.connection.vfse
                      ? buttonBackground
                      : "",
                  }}
                  checked={formik.values.connection.vfse}
                />
                <span className="text">{vFSE} [VNC OR OTHER]</span>
              </Grid>
              <Grid item xs={12} md={4} lg={4} className="checkBox">
                <Checkbox
                  name="connection.ssh"
                  onClick={formik.handleChange}
                  style={{
                    color: formik.values.connection.ssh ? buttonBackground : "",
                  }}
                  checked={formik.values.connection.ssh}
                />
                <span className="text">{ssh}[or terminal]</span>
              </Grid>
              <Grid item xs={12} md={4} lg={4} className="checkBox">
                <Checkbox
                  name="connection.web"
                  onClick={formik.handleChange}
                  style={{
                    color: formik.values.connection.web ? buttonBackground : "",
                  }}
                  checked={formik.values.connection.web}
                />
                <span className="text">{serviceWebBrowser}</span>
              </Grid>
              <Grid item xs={12} md={4} lg={4} className="checkBox">
                <Checkbox
                  name="connection.virtual"
                  onClick={formik.handleChange}
                  style={{
                    color: formik.values.connection.virtual
                      ? buttonBackground
                      : "",
                  }}
                  checked={formik.values.connection.virtual}
                />
                <span className="text">{virtualMediaControl}</span>
              </Grid>
            </Grid>
            {formik.values.connection.ssh && (
              <Grid container spacing={2} style={{ marginTop: "5px" }}>
                <Grid item xs={12} sm={6}>
                  <div className="info-section">
                    <p className="info-label">SSH User</p>
                    <TextField
                      autoComplete="off"
                      className="info-field"
                      variant="outlined"
                      size="small"
                      placeholder="sdc"
                      name="sshUser"
                      value={formik.values.sshUser}
                      onChange={formik.handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className="info-section">
                    <p className="info-label">SSH Password</p>
                    <TextField
                      autoComplete="off"
                      className="info-field"
                      variant="outlined"
                      type="password"
                      size="small"
                      placeholder="Password"
                      name="sshPassword"
                      value={formik.values.sshPassword}
                      onChange={formik.handleChange}
                    />
                  </div>
                </Grid>
              </Grid>
            )}
            {formik.values.connection.vfse && (
              <Grid container spacing={2} style={{ marginTop: "5px" }}>
                <Grid item xs={12} sm={6}>
                  <div className="info-section">
                    <p className="info-label">Telnet User</p>
                    <TextField
                      autoComplete="off"
                      className="info-field"
                      variant="outlined"
                      size="small"
                      placeholder="sdc"
                      name="telnetUser"
                      value={formik.values.telnetUser}
                      onChange={formik.handleChange}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <div className="info-section">
                    <p className="info-label">Telnet Password</p>
                    <TextField
                      autoComplete="off"
                      className="info-field"
                      variant="outlined"
                      type="password"
                      size="small"
                      placeholder="Password"
                      name="telnetPassword"
                      value={formik.values.telnetPassword}
                      onChange={formik.handleChange}
                    />
                  </div>
                </Grid>
              </Grid>
            )}
            <Grid container spacing={2} style={{ marginTop: "5px" }}>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">{systemContactInfo}</p>
                  <TextField
                    autoComplete="off"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    placeholder="971-091-9353x05482"
                    name="contactInfo"
                    value={formik.values.contactInfo}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: "5px" }}>
              <Grid item xs={12}>
                <div className="info-section">
                  <p className="info-label">{fieldLink}</p>
                  <TextField
                    autoComplete="off"
                    className="info-field"
                    variant="outlined"
                    size="small"
                    type="url"
                    placeholder="https://example.com"
                    name="grafana"
                    error={
                      formik.touched.grafana && Boolean(formik.errors.grafana)
                    }
                    helperText={formik.touched.grafana && formik.errors.grafana}
                    value={formik.values.grafana}
                    onChange={formik.handleChange}
                  />
                </div>
              </Grid>
            </Grid>
            <div className="box-heading">
              {isShowRis && (
                <>
                  {" "}
                  <p className="heading">{fieldRisName}</p>
                  <div className="box">
                    <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                      <Grid item xs={12} sm={6}>
                        <p className="info-label">{fieldRisIp}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          size="small"
                          placeholder="192.165.3.2"
                          name="ris.ip"
                          value={formik.values.ris.ip}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <p className="info-label">{fieldRisTitle}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          size="small"
                          placeholder="HS1"
                          name="ris.title"
                          value={formik.values.ris.title}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <p className="info-label">{fieldRisPort}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          placeholder="200"
                          size="small"
                          type="number"
                          name="ris.port"
                          value={formik.values.ris.port}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <p className="info-label">{fieldRisAE}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          size="small"
                          placeholder="system 1"
                          name="ris.ae"
                          value={formik.values.ris.ae}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </>
              )}
              {isDiscom && (
                <div className="box-heading">
                  <p className="heading">{fieldDicomName}</p>
                  <div className="box">
                    <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                      <Grid item xs={12} sm={6}>
                        <p className="info-label">{fieldDicomIp}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          size="small"
                          placeholder="192.165.3.2"
                          name="dicom.ip"
                          value={formik.values.dicom.ip}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <p className="info-label">{fieldDicomTitle}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          size="small"
                          placeholder="Dic 1"
                          name="dicom.title"
                          value={formik.values.dicom.title}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <p className="info-label">{fieldDicomPort}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          placeholder="280"
                          size="small"
                          type="number"
                          name="dicom.port"
                          value={formik.values.dicom.port}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <p className="info-label">{fieldDicomAE}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          size="small"
                          placeholder="system 1"
                          name="dicom.ae"
                          value={formik.values.dicom.ae}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </div>
              )}
              {isMri ? (
                <div className="box-heading">
                  <p className="heading">{fieldMRIname}</p>
                  <div className="box">
                    <Grid container spacing={2} style={{ marginBottom: "5px" }}>
                      <Grid item xs={6}>
                        <p className="info-label">{fieldMRIHelium}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          size="small"
                          placeholder="strong"
                          name="mri.helium"
                          value={formik.values.mri.helium}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <p className="info-label">{fieldMRIMagnet}</p>
                        <TextField
                          autoComplete="off"
                          className="info-field"
                          variant="outlined"
                          size="small"
                          placeholder="low"
                          name="mri.magnet"
                          value={formik.values.mri.magnet}
                          onChange={formik.handleChange}
                        />
                      </Grid>
                    </Grid>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </DialogContent>
      <form onSubmit={formik.handleSubmit}>
        <DialogActions>
          <Button
            className="cancel-btn"
            style={{
              backgroundColor: disableButton ? "#d9dbdd" : secondaryColor,
              color: buttonTextColor,
            }}
            onClick={handleClear}
            disabled={disableButton}
          >
            {btnCancel}
          </Button>
          <Button
            className="add-btn"
            style={{
              backgroundColor: disableButton ? "#d9dbdd" : buttonBackground,
              color: buttonTextColor,
            }}
            type="submit"
            disabled={disableButton}
          >
            {props.system ? btnEdit : btnAdd}
          </Button>
        </DialogActions>
        <AddManufacturerModal
          setModalityValue={(modality) =>
            formik.setFieldValue("modality", modality)
          }
          modality={parseInt(formik.values.modality)}
          open={openManufacturerModal}
          handleClose={() => setOpenManufacturerModal(false)}
        />
        <ProductModal
          manufacturer={parseInt(formik.values.manufacturer)}
          modality={parseInt(formik.values.modality)}
          setProductValue={(product) =>
            formik.setFieldValue("product", product)
          }
          open={openProductModal}
          handleClose={() => setOpenProductModal(false)}
        />
        <AddProductModelDialog
          product={parseInt(formik.values.product)}
          modality={parseInt(formik.values.modality)}
          setProductAndModalityValue={(product, modality) => {
            formik.setFieldValue("product", product);
            formik.setFieldValue("modality", modality);
          }}
          open={openAddProductModelDialog}
          handleClose={() => setOpenAddProductModelDialog(false)}
        />
      </form>
    </Dialog>
  );
}
