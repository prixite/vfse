import { useEffect, useState } from "react";

import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Radio from "@mui/material/Radio";
import { Buffer } from "buffer";
import { useFormik } from "formik";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import NumberIcon from "@src/assets/svgs/number.svg";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import SitesMenu from "@src/components/common/smart/sitesMenu/SitesMenu";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import { toastAPIError } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import {
  addNewUserService,
  updateUserService,
} from "@src/services/userService";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import "@src/components/shared/popUps/userModal/userModal.scss";
import {
  Modality,
  Organization,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsSitesListQuery,
  User,
  useUsersPartialUpdateMutation,
  useScopeUsersCreateMutation,
  useOrganizationsUsersListQuery,
  useOrganizationsSystemsListQuery,
  Role,
} from "@src/store/reducers/api";

import useUserSite from "./useUserSites";

interface Props {
  open: boolean;
  handleClose: () => void;
  selectedUser?: number;
  usersData?: Array<User>;
  roles: Role[];
  organizationData?: Array<Organization>;
  modalitiesList?: Array<Modality>;
  action: string;
}

const initialState = {
  userProfileImage: "",
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  role: "",
  manager: undefined,
  customer: undefined,
  selectedModalities: [],
  selectedSites: [],
  selectedSystems: [],
  docLink: false,
  possibilitytoLeave: false,
  accessToFSEFunctions: false,
  viewOnly: false,
  auditEnable: false,
  oneTimeLinkCreation: false,
};
// eslint-disable-next-line
const nameReg = /^[A-Za-z ]*$/;
// eslint-disable-next-line
const emailRegX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
// eslint-disable-next-line
const phoneReg = /^(\+1)[0-9]{10}$/;

const validationSchema = yup.object({
  userProfileImage: yup
    .string()
    .required(constantsData.users.popUp.imageRequired),
  firstname: yup
    .string()
    .matches(nameReg)
    .required(constantsData.users.popUp.firstNameRequired),
  lastname: yup
    .string()
    .matches(nameReg)
    .required(constantsData.users.popUp.lastNameRequired),
  email: yup
    .string()
    .matches(emailRegX, constantsData.users.popUp.invalidEmailText) //TODO
    .required(constantsData.users.popUp.emailRequired),
});

window.Buffer = window.Buffer || Buffer;

export default function UserModal(props: Props) {
  const [page, setPage] = useState("1");
  const [selectedImage, setSelectedImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneError, setIsPhoneError] = useState("");
  const { toastData } = constantsData;
  const constantData = localizedData()?.users?.popUp;
  const {
    addNewUser,
    pageTrackerdesc1,
    pageTrackerdesc2,
    btnCancel,
    btnNext,
    btnAddUser,
    userFirstName,
    btnToSave,
    userLastName,
    userEmail,
    userPhoneNumber,
    userRole,
    userManager,
    userCustomer,
    addText,
    manager,
    customer,
    role,
    edit,
    userProfileImage,
    phone,
    selectedSites,
    selectedModalities,
    accessToFSEFunctions,
    auditEnable,
    possibilitytoLeave,
    viewOnly,
    oneTimeLinkCreation,
    docLink,
    userProfileImageText,
    editUserText,
    profileImageText,
    sitesText,
    healthNetworkAccessText,
    organizationSitesText,
    accessToModalities,
  } = constantData;

  const [onChangeValidation, setOnChangeValidation] = useState(false);

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      if (props?.action === addText) {
        handleAddUser();
      } else {
        handleEditUser();
      }
    },
  });

  const { data: networksData } = useOrganizationsHealthNetworksListQuery(
    {
      id: formik.values.customer?.toString(),
    },
    {
      skip: !formik.values.customer,
    }
  );
  const { data: organizationSitesData } = useOrganizationsSitesListQuery(
    {
      id: formik.values.customer?.toString(),
    },
    {
      skip: !formik.values.customer,
    }
  );
  const editedUser = props?.usersData?.find((user) => {
    return user?.id == props?.selectedUser;
  });

  const userSitesMap = useUserSite({
    networksData,
    organizationSitesData,
    userSites: editedUser?.sites,
  });

  const { data: managers = [] } = useOrganizationsUsersListQuery(
    {
      id: formik.values.customer?.toString(),
    },
    {
      skip: !formik.values.customer,
    }
  );
  const { data: systemsList, isLoading: systemsListLoading } =
    useOrganizationsSystemsListQuery({
      id: formik?.values?.customer,
    });

  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const [createUser] = useScopeUsersCreateMutation();
  const [updateUser] = useUsersPartialUpdateMutation();

  const selectedOrganization = useSelectedOrganization();

  const { usersData } = props;

  useEffect(() => {
    if (props?.action == addText) {
      if (usersData?.length) {
        formik.setFieldValue(manager, usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        formik.setFieldValue(customer, props?.organizationData[0]?.id);
      }
      if (props?.roles?.length) {
        formik.setFieldValue(role, props?.roles[0].value);
      }
    }
  }, []);

  useEffect(() => {
    if (props?.selectedUser && props?.action == edit) {
      populateEditableData();
    }
  }, [props?.selectedUser, networksData, organizationSitesData]);

  useEffect(() => {
    if (selectedImage?.length) {
      formik.setFieldValue(userProfileImage, selectedImage[0]);
    }
  }, [selectedImage]);

  const populateEditableData = () => {
    if (editedUser?.image?.length) {
      formik.setValues({
        ...formik.values,
        userProfileImage: editedUser?.image,
        firstname: editedUser?.first_name,
        lastname: editedUser?.last_name,
        email: editedUser?.email,
      });
      if (editedUser?.phone?.length && editedUser?.phone?.indexOf("+1") > -1) {
        formik.setFieldValue(phone, editedUser?.phone?.substring(2));
      }
      if (editedUser?.role?.length) {
        formik.setFieldValue(role, editedUser.role[0]);
      }
      if (editedUser?.manager) {
        formik.setFieldValue(
          manager,
          usersData?.filter(
            (user) => user?.email == editedUser?.manager?.email
          )[0]?.id
        );
      } else {
        if (usersData?.length) {
          formik.setFieldValue(manager, usersData[0]?.id);
        }
      }
      if (editedUser?.organizations?.length) {
        formik.setFieldValue(
          customer,
          props?.organizationData?.filter((org) => {
            return (
              org?.name?.toString() == editedUser?.organizations[0]?.toString()
            );
          })[0]?.id
        );
      }
      if (editedUser?.sites) {
        formik.setFieldValue(selectedSites, [...userSitesMap.keys()]);
      }

      if (editedUser?.systems?.length) {
        const system_ids: Array<number> = [];
        editedUser?.systems?.forEach((system) => {
          system_ids.push(system);
        });
        formik.setFieldValue("selectedSystems", system_ids);
      }

      if (editedUser?.modalities?.length) {
        const filterModalities = props?.modalitiesList?.filter((modality) => {
          return editedUser?.modalities?.includes(modality?.name?.toString());
        });
        const mod_ids: Array<number> = [];
        filterModalities?.forEach((mod) => {
          mod_ids.push(mod?.id);
        });
        formik.setFieldValue(selectedModalities, mod_ids);
      }
      if (editedUser?.fse_accessible) {
        formik.setFieldValue(accessToFSEFunctions, editedUser?.fse_accessible);
      }
      if (editedUser?.audit_enabled) {
        formik.setFieldValue(auditEnable, editedUser?.audit_enabled);
      }
      if (editedUser?.can_leave_notes) {
        formik.setFieldValue(possibilitytoLeave, editedUser?.can_leave_notes);
      }
      if (editedUser?.view_only) {
        formik.setFieldValue(viewOnly, editedUser?.view_only);
      }
      if (editedUser?.is_one_time) {
        formik.setFieldValue(oneTimeLinkCreation, editedUser?.is_one_time);
      }
      if (editedUser?.documentation_url) {
        formik.setFieldValue(docLink, editedUser?.documentation_url);
      }
    }
  };

  const handleChange = (event) => {
    if (page == "1") {
      moveToNextPage();
    } else {
      setPage(event.target.value);
    }
  };

  const handleSitesSelection = (e) => {
    const val = parseInt(e?.target?.value || e);
    const { systemsSiteList, systemInSiteExists } = handelSitesOfSystem(val);

    if (!systemInSiteExists) {
      formik.setFieldValue("selectedSystems", [
        ...formik.values.selectedSystems,
        ...systemsSiteList.map((x) => x.id),
      ]);
    } else {
      const selectedSystemsInSite = formik.values.selectedSystems.filter(
        (x) => !systemsSiteList.some((j) => x === j.id)
      );
      formik.setFieldValue("selectedSystems", [...selectedSystemsInSite]);
    }

    modifySelectedSiteList(val);
    const temp = [...formik.values.selectedModalities];
    for (const system of systemsSiteList) {
      if (
        !systemsSiteList.filter((item) =>
          formik.values.selectedSystems.includes(item.id)
        ).length ||
        formik.values.selectedSystems.includes(system.id)
      ) {
        modifySelectedModalities(system, temp);
      }
    }
  };

  const modifySelectedModalities = (system, temp) => {
    const modality = systemsList
      ?.filter((item) => item?.id == system?.id)
      ?.map((item) => item?.product_model_detail?.modality?.id)[0];

    const systems = systemsList
      ?.filter((item) => item?.product_model_detail?.modality?.id == modality)
      .filter((item) => item?.id != system?.id);

    if (
      systems?.length &&
      systems?.some((item) => formik.values.selectedSystems.includes(item?.id))
    ) {
      return;
    }

    const selectedModalityIndex = temp?.indexOf(modality);
    if (selectedModalityIndex > -1) {
      temp?.splice(selectedModalityIndex, 1);
    } else {
      temp?.push(modality);
    }
    formik.setFieldValue(selectedModalities, [...temp]);
  };

  const modifySelectedSiteList = (val) => {
    const siteIndex = formik.values.selectedSites.indexOf(val);
    if (siteIndex > -1) {
      formik.values.selectedSites?.splice(siteIndex, 1);
      formik.setFieldValue(selectedSites, [...formik.values.selectedSites]);
    } else {
      formik.setFieldValue(selectedSites, [
        ...formik.values.selectedSites,
        val,
      ]);
    }
  };

  const handelSitesOfSystem = (site) => {
    const systemsSiteList = systemsList?.filter((item) => item?.site === site);

    const systemInSiteExists = systemsSiteList.some((item) =>
      formik.values.selectedSystems.includes(item?.id)
    );

    return { systemsSiteList, systemInSiteExists };
  };

  const handleSystemSelection = (e, site) => {
    const val = parseInt(e?.target?.value || e);
    const selectedSystemIndex = formik.values.selectedSystems.indexOf(val);
    if (selectedSystemIndex > -1) {
      formik.values.selectedSystems?.splice(selectedSystemIndex, 1);
      formik.setFieldValue("selectedSystems", [
        ...formik.values.selectedSystems,
      ]);
    } else {
      formik.setFieldValue("selectedSystems", [
        ...formik.values.selectedSystems,
        val,
      ]);
    }

    const { systemInSiteExists } = handelSitesOfSystem(site);
    if (
      !e?.target?.checked && //uncheck
      formik.values.selectedSites.includes(site) && //site checked
      !systemInSiteExists //system does not exist
    ) {
      modifySelectedSiteList(site);
    } else if (
      e?.target?.checked &&
      !formik.values.selectedSites.includes(site)
    ) {
      modifySelectedSiteList(site);
    }

    const modality = systemsList
      .filter((item) => item?.id == val)
      .map((item) => item?.product_model_detail?.modality?.id)[0];

    const systems = systemsList
      ?.filter((item) => item?.product_model_detail?.modality?.id == modality)
      .filter((item) => item?.id != val);

    if (
      systems.length &&
      systems.some((item) => formik?.values?.selectedSystems.includes(item?.id))
    ) {
      return;
    }

    const selectedModalityIndex =
      formik.values.selectedModalities.indexOf(modality);

    if (selectedModalityIndex > -1) {
      formik.values.selectedModalities?.splice(selectedModalityIndex, 1);
      formik.setFieldValue(selectedModalities, [
        ...formik.values.selectedModalities,
      ]);
    } else {
      formik.setFieldValue(selectedModalities, [
        ...formik.values.selectedModalities,
        modality,
      ]);
    }
  };

  const handleSelectedModalities = async (event, newFormats) => {
    const systems = systemsList?.filter(
      (item) => item?.product_model_detail?.modality?.id == event.target.value
    );
    const temp = new Set(formik.values.selectedSystems);
    const temp2 = new Set(formik.values.selectedSites);
    const selectedSystemsInModality = systems.filter((item) =>
      formik.values.selectedSystems.includes(item?.id)
    );
    if (selectedSystemsInModality.length === systems.length) {
      for (const item of systems) {
        temp.delete(item.id);
        const allSystemOfSite = systemsList.filter(
          (system) => system.site === item.site
        );
        const allSystemOfSiteModality = systems.filter(
          (system) => system.site === item.site
        );
        const selectedSystemofSite = allSystemOfSite.filter((system) =>
          formik.values.selectedSystems.includes(system.id)
        );
        if (selectedSystemofSite.length === allSystemOfSiteModality.length) {
          temp2.delete(item.site);
        }
      }
      formik.setFieldValue(
        selectedModalities,
        formik.values.selectedModalities.filter(
          (modality) => modality !== event.target.value
        )
      );
    } else {
      const _systems = systems?.filter(
        (item) => !formik?.values?.selectedSystems?.includes(item?.id)
      );
      for (const system of _systems) {
        temp.add(system?.id);
        temp2.add(system?.site);
      }
      formik.setFieldValue(selectedModalities, [...newFormats]);
    }

    formik.setFieldValue("selectedSystems", [...Array.from(temp)]);
    formik.setFieldValue("selectedSites", [...Array.from(temp2)]);
  };

  const sitesLength = () => {
    let count = 0;
    networksData?.forEach((item) => {
      if (item?.sites?.length) {
        count += item?.sites?.length;
      }
    });
    if (organizationSitesData && organizationSitesData?.length) {
      count += organizationSitesData?.length;
    }
    return count;
  };

  const getNetworkSitesLength = () => {
    let count = 0;
    networksData?.forEach((item) => {
      if (item?.sites?.length) {
        count += item?.sites?.length;
      }
    });
    return count;
  };

  const handleAddUser = async () => {
    setIsLoading(true);
    if (formik.isValid) {
      await uploadImageToS3(selectedImage[0]).then(
        async (data: S3Interface) => {
          const userObject = getUserObject(data?.location);
          await addNewUserService(
            selectedOrganization.id,
            userObject,
            createUser
          )
            .then(() => {
              setTimeout(() => {
                resetModal();
                setIsLoading(false);
              }, 500);
            })
            .catch((err) => {
              toastAPIError(toastData.userAlreadyExists, err.status, err.data);
              setIsLoading(false);
            });
        }
      );
    } else {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    setIsLoading(true);
    if (formik.isValid) {
      if (!selectedImage.length && formik.values.userProfileImage?.length) {
        performEditUser(formik.values.userProfileImage);
      } else {
        await uploadImageToS3(selectedImage[0]).then(
          async (data: S3Interface) => {
            performEditUser(data?.location);
          }
        );
      }
    } else {
      setIsLoading(false);
    }
  };

  const performEditUser = async (data: string) => {
    const userObject = constructObject(data);
    await updateUserService(props?.selectedUser, userObject, updateUser)
      .then(() => {
        setTimeout(() => {
          resetModal();
          setIsLoading(false);
        }, 500);
      })
      .catch((error) => {
        toastAPIError(toastData.saveUserError, error.status, error.data);
        setIsLoading(false);
      });
  };

  const getUserObject = (imageUrl: string) => {
    return {
      memberships: [constructObject(imageUrl)],
    };
  };

  const constructObject = (imageUrl: string) => {
    const obj = {
      meta: {
        profile_picture: imageUrl,
        title: userProfileImageText,
      },
      first_name: formik.values.firstname,
      last_name: formik.values.lastname,
      email: formik.values.email,
      phone: `+1${formik.values.phone}`,
      role: formik.values.role,
      organization: formik.values.customer,
      sites: formik.values.selectedSites,
      systems: formik.values.selectedSystems,
      modalities: formik.values.selectedModalities,
      fse_accessible: formik.values.accessToFSEFunctions,
      audit_enabled: formik.values.auditEnable,
      can_leave_notes: formik.values.possibilitytoLeave,
      view_only: formik.values.viewOnly,
      is_one_time: formik.values.oneTimeLinkCreation,
      documentation_url: formik.values.docLink,
    };
    if (formik.values.manager !== -1) {
      obj["manager"] = formik.values.manager;
    }
    return obj;
  };

  const resetModal = () => {
    if (props?.action == addText) {
      formik.resetForm();
      formik.setFieldValue(userProfileImage, selectedImage[0]);
      if (usersData?.length) {
        formik.setFieldValue(manager, usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        formik.setFieldValue(customer, props?.organizationData[0]?.id);
      }
    } else if (props?.action == edit) {
      populateEditableData();
      formik.resetForm();
      formik.setFieldValue(userProfileImage, selectedImage[0]);
    }
    props?.handleClose();
  };

  const moveToNextPage = async () => {
    const phoneValue = `+1${formik.values.phone}`;
    const errors = await formik.validateForm();
    if (!Object.keys(errors).length && phoneValue.match(phoneReg)) {
      await setPage("2");
      setIsPhoneError("");
    } else {
      setIsPhoneError(constantsData.users.popUp.invalidPhoneFormat);
      setOnChangeValidation(true);
    }
  };

  function getModalityColor(item: number): string {
    const systems = systemsList?.filter(
      (system) => system?.product_model_detail?.modality?.id == item
    );
    if (
      systems?.length &&
      systems?.every((_system) =>
        formik.values.selectedSystems.includes(_system.id)
      )
    ) {
      return "toggle-btn primaryToggle";
    } else if (
      systems?.length &&
      systems?.some((_system) =>
        formik.values.selectedSystems.includes(_system.id)
      )
    ) {
      return "toggle-btn standardToggle";
    } else {
      return "toggle-btn";
    }
  }

  return (
    <Dialog className="users-modal" open={props.open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">
            {!props?.selectedUser ? addNewUser : editUserText}
          </span>
          <span className="dialog-page">
            <span className="pg-number">
              {`${pageTrackerdesc1} ${page} ${pageTrackerdesc2}`}
              <span style={{ marginLeft: "16px" }}>
                <Radio
                  checked={page === "1"}
                  onChange={handleChange}
                  value="1"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "1" }}
                  size="small"
                  sx={{
                    "&.Mui-checked": {
                      color: buttonBackground,
                    },
                  }}
                />
                <Radio
                  checked={page === "2"}
                  onChange={handleChange}
                  value="2"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "2" }}
                  size="small"
                  sx={{
                    "&.Mui-checked": {
                      color: buttonBackground,
                    },
                  }}
                />
              </span>
            </span>
            <img
              src={CloseBtn}
              className="cross-btn"
              onClick={resetModal}
              alt=""
            />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          {page === "1" ? (
            <>
              <div>
                <p className="info-label required">{profileImageText}</p>
                <DropzoneBox
                  imgSrc={formik.values.userProfileImage}
                  setSelectedImage={setSelectedImage}
                  selectedImage={selectedImage}
                />
                {
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.userProfileImage}
                  </p>
                }
              </div>
              <div>
                <p className="info-label required">{userFirstName}</p>
                <TextField
                  autoComplete="off"
                  name="firstname"
                  className="full-field"
                  value={formik.values.firstname}
                  type="text"
                  onChange={formik.handleChange}
                  variant="outlined"
                  placeholder="First Name"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.errors.firstname}
                </p>
              </div>
              <div>
                <p className="info-label required">{userLastName}</p>
                <TextField
                  autoComplete="off"
                  name="lastname"
                  className="full-field"
                  type="text"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  variant="outlined"
                  placeholder="Last Name"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {formik.errors.lastname}
                </p>
              </div>
              <div className="divided-div">
                <div>
                  <p className="info-label required">{userEmail}</p>
                  <TextField
                    autoComplete="off"
                    name="email"
                    className="info-field"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    variant="outlined"
                    placeholder="Email"
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {formik.errors.email}
                  </p>
                </div>
                <div>
                  <p className="info-label required">{userPhoneNumber}</p>
                  <TextField
                    autoComplete="off"
                    name="phone"
                    className="info-field"
                    variant="outlined"
                    value={formik.values.phone}
                    type="number"
                    onChange={formik.handleChange}
                    placeholder="1234567890"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={NumberIcon} alt="" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {isPhoneError}
                  </p>
                </div>
              </div>
              <div className="divided-div">
                <div>
                  <p className="info-label">{userRole}</p>
                  <FormControl sx={{ minWidth: 356 }}>
                    <Select
                      name="role"
                      value={formik.values.role}
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "43px", borderRadius: "8px" }}
                      onChange={formik.handleChange}
                      disabled={!props?.roles?.length}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                      defaultValue="none"
                    >
                      {props?.roles?.map((item, key) => (
                        <MenuItem key={key} value={item.value}>
                          {item?.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <p className="info-label">{userManager}</p>
                  <FormControl sx={{ minWidth: 356 }}>
                    <Select
                      name="manager"
                      value={formik.values.manager}
                      inputProps={{ "aria-label": "Without label" }}
                      style={{
                        height: "43px",
                        borderRadius: "8px",
                        color: formik.values.manager == -1 ? "darkgray" : "",
                      }}
                      onChange={formik.handleChange}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                      disabled={!managers.length}
                    >
                      {managers.map((item, key) => (
                        <MenuItem
                          key={key}
                          value={item?.id}
                          style={{ color: item?.id == -1 ? "darkgray" : "" }}
                        >
                          {item?.username}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div>
                <p className="info-label">{userCustomer}</p>
                <FormControl sx={{ width: "100%" }}>
                  <Select
                    name="customer"
                    value={formik.values.customer}
                    disabled={props?.action == "edit"}
                    inputProps={{ "aria-label": "Without label" }}
                    style={{ height: "43px", borderRadius: "8px" }}
                    onChange={formik.handleChange}
                    MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                  >
                    {props?.organizationData?.map((item, key) => (
                      <MenuItem key={key} value={item?.id}>
                        {item?.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </>
          ) : (
            <>
              <div>
                {sitesLength() > 0 ? (
                  <p className="modalities-header">
                    <span className="info-label">{sitesText}</span>
                    <span className="checked-ratio">{`${
                      formik.values.selectedSites?.length
                    }/${sitesLength()}`}</span>
                  </p>
                ) : (
                  ""
                )}
                {getNetworkSitesLength() > 0 ? (
                  <p className="modalities-header">
                    <span style={{ fontWeight: "600" }}>
                      {healthNetworkAccessText}
                    </span>
                  </p>
                ) : (
                  ""
                )}
                {networksData?.map((item, key) =>
                  item?.sites?.length ? (
                    <div key={key}>
                      <details className="network-details">
                        <summary
                          className="header"
                          style={{ cursor: "pointer" }}
                        >
                          <span className="title">{item?.name}</span>
                        </summary>
                        {item?.sites?.map((site, key) => {
                          const systems = systemsList?.filter(
                            (item) => item?.site === site?.id
                          );
                          return (
                            <SitesMenu
                              key={key}
                              site={site}
                              systems={systems}
                              formik={formik}
                              handleSitesSelection={handleSitesSelection}
                              handleSystemSelection={handleSystemSelection}
                            />
                          );
                        })}
                      </details>
                    </div>
                  ) : (
                    ""
                  )
                )}
                {organizationSitesData && organizationSitesData?.length ? (
                  <>
                    <p className="modalities-header">
                      <span style={{ fontWeight: "600" }}>
                        {organizationSitesText}
                      </span>
                    </p>
                    <div className="network-details">
                      {!systemsListLoading &&
                        organizationSitesData?.map((site, key) => {
                          const systems = systemsList?.filter(
                            (item) => item?.site === site?.id
                          );
                          return (
                            <SitesMenu
                              key={key}
                              site={site}
                              systems={systems}
                              formik={formik}
                              handleSitesSelection={handleSitesSelection}
                              handleSystemSelection={handleSystemSelection}
                            />
                          );
                        })}
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div>
                {props?.modalitiesList?.length ? (
                  <p className="modalities-header">
                    <span className="info-label">{accessToModalities}</span>
                    <span className="checked-ratio">{`${formik.values.selectedModalities?.length}/${props?.modalitiesList?.length}`}</span>
                  </p>
                ) : (
                  ""
                )}
                <ToggleButtonGroup
                  value={formik.values.selectedModalities}
                  color="primary"
                  onChange={handleSelectedModalities}
                  aria-label="text formatting"
                  style={{ flexWrap: "wrap" }}
                >
                  {props?.modalitiesList?.length &&
                    props?.modalitiesList?.map((item, key) => {
                      return (
                        <ToggleButton
                          key={key}
                          value={item?.id}
                          className={getModalityColor(item?.id)}
                        >
                          {item?.name}
                        </ToggleButton>
                      );
                    })}
                </ToggleButtonGroup>
              </div>
              <div className="services">
                <FormGroup className="service-options">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.docLink}
                        onClick={() =>
                          formik.setFieldValue(
                            "docLink",
                            !formik.values.docLink
                          )
                        }
                      />
                    }
                    label="Documentation Link Available"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.accessToFSEFunctions}
                        onClick={() =>
                          formik.setFieldValue(
                            "accessToFSEFunctions",
                            !formik.values.accessToFSEFunctions
                          )
                        }
                      />
                    }
                    label="Access to FSE functions"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.auditEnable}
                        onClick={() =>
                          formik.setFieldValue(
                            "auditEnable",
                            !formik.values.auditEnable
                          )
                        }
                      />
                    }
                    label="Audit Enable"
                  />
                </FormGroup>

                <FormGroup className="options">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.possibilitytoLeave}
                        onClick={() =>
                          formik.setFieldValue(
                            "possibilitytoLeave",
                            !formik.values.possibilitytoLeave
                          )
                        }
                      />
                    }
                    label="Possibility to Leave Notes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.viewOnly}
                        onClick={() =>
                          formik.setFieldValue(
                            "viewOnly",
                            !formik.values.viewOnly
                          )
                        }
                      />
                    }
                    label="View Only"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.oneTimeLinkCreation}
                        onClick={() =>
                          formik.setFieldValue(
                            "oneTimeLinkCreation",
                            !formik.values.oneTimeLinkCreation
                          )
                        }
                      />
                    }
                    label="One-time Link Creation"
                  />
                </FormGroup>
              </div>
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions
        style={{
          padding: "20px 24px",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={
            isLoading
              ? {
                  backgroundColor: "lightgray",
                  color: buttonTextColor,
                }
              : {
                  backgroundColor: secondaryColor,
                  color: buttonTextColor,
                }
          }
          onClick={resetModal}
          disabled={isLoading}
          className="cancel-btn"
        >
          {btnCancel}
        </Button>

        {page === "1" ? (
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            onClick={moveToNextPage}
            className="add-btn"
          >
            {btnNext}
          </Button>
        ) : (
          <Button
            style={
              isLoading
                ? {
                    backgroundColor: "lightgray",
                    color: buttonTextColor,
                  }
                : {
                    backgroundColor: buttonBackground,
                    color: buttonTextColor,
                  }
            }
            disabled={isLoading}
            onClick={() => formik.handleSubmit()}
            className="add-btn"
          >
            {props?.action == "add" ? btnAddUser : btnToSave}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
