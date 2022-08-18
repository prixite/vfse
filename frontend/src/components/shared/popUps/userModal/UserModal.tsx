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
import { toast } from "react-toastify";
import * as yup from "yup";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import NumberIcon from "@src/assets/svgs/number.svg";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
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
} from "@src/store/reducers/api";

interface Props {
  open: boolean;
  handleClose: () => void;
  selectedUser?: number;
  usersData?: Array<User>;
  roles: unknown;
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
const phoneReg = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;

const validationSchema = yup.object({
  userProfileImage: yup.string().required("Image is required!"),
  firstname: yup.string().matches(nameReg).required("FirstName is required!"),
  lastname: yup.string().matches(nameReg).required("Lastname is required!"),
  email: yup
    .string()
    .matches(emailRegX, "Invalid E-mail!") //TODO
    .required("Email is required!"),
  phone: yup
    .string()
    .max(10, "Phone number must not be greater than 10 digits")
    .matches(phoneReg)
    .typeError("Invalid Phone Format") //TODO
    .required("Phone is required!"),
});

window.Buffer = window.Buffer || Buffer;

export default function UserModal(props: Props) {
  const [page, setPage] = useState("1");
  const [selectedImage, setSelectedImage] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const constantData = localizedData()?.users?.popUp;

  const [onChangeValidation, setOnChangeValidation] = useState(false);

  const formik = useFormik({
    initialValues: initialState,
    validationSchema: validationSchema,
    validateOnChange: onChangeValidation,
    onSubmit: () => {
      if (props?.action === "add") {
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

  const { data: managers = [] } = useOrganizationsUsersListQuery(
    {
      id: formik.values.customer?.toString(),
    },
    {
      skip: !formik.values.customer,
    }
  );

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
  } = constantData;
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );

  const [createUser] = useScopeUsersCreateMutation();
  const [updateUser] = useUsersPartialUpdateMutation();

  const selectedOrganization = useSelectedOrganization();

  const usersData = Array.from(props?.usersData);
  usersData?.unshift({ id: -1, username: "Select Manager" });

  useEffect(() => {
    if (props?.action == "add") {
      if (usersData?.length) {
        formik.setFieldValue("manager", usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        formik.setFieldValue("customer", props?.organizationData[0]?.id);
      }
      if (props?.roles?.length) {
        formik.setFieldValue("role", props?.roles[0].value);
      }
    }
  }, []);

  useEffect(() => {
    if (props?.selectedUser && props?.action == "edit") {
      populateEditableData();
    }
  }, [props?.selectedUser, networksData, organizationSitesData]);

  useEffect(() => {
    if (selectedImage?.length) {
      formik.setFieldValue("userProfileImage", selectedImage[0]);
    }
  }, [selectedImage]);

  const populateEditableData = () => {
    const editedUser: User = usersData?.filter((user) => {
      return user?.id == props?.selectedUser;
    })[0];
    if (editedUser?.image?.length) {
      formik.setValues({
        ...formik.values,
        userProfileImage: editedUser?.image,
        firstname: editedUser?.first_name,
        lastname: editedUser?.last_name,
        email: editedUser?.email,
      });
      if (editedUser?.phone?.length && editedUser?.phone?.indexOf("+1") > -1) {
        formik.setFieldValue("phone", editedUser?.phone?.substring(2));
      }
      if (editedUser?.role?.length) {
        formik.setFieldValue("role", editedUser.role[0]);
      }
      if (editedUser?.manager) {
        formik.setFieldValue(
          "manager",
          usersData?.filter(
            (user) => user?.email == editedUser?.manager?.email
          )[0]?.id
        );
      } else {
        if (usersData?.length) {
          formik.setFieldValue("manager", usersData[0]?.id);
        }
      }
      if (editedUser?.organizations?.length) {
        formik.setFieldValue(
          "customer",
          props?.organizationData?.filter((org) => {
            return (
              org?.name?.toString() == editedUser?.organizations[0]?.toString()
            );
          })[0]?.id
        );
      }
      if (editedUser?.sites) {
        const sites_ids: Array<number> = [];
        networksData?.forEach((item) => {
          item?.sites?.length &&
            item?.sites?.forEach((site) => {
              editedUser?.sites?.forEach((newSite) => {
                if (newSite == site?.name) {
                  sites_ids.push(site?.id);
                }
              });
            });
        });
        organizationSitesData?.forEach((site) => {
          editedUser?.sites?.forEach((newSite) => {
            if (newSite == site?.name) {
              sites_ids.push(site?.id);
            }
          });
        });
        if (sites_ids?.length == editedUser?.sites?.length) {
          formik.setFieldValue("selectedSites", sites_ids);
        }
      }
      if (editedUser?.modalities?.length) {
        const filterModalities = props?.modalitiesList?.filter((modality) => {
          return editedUser?.modalities?.includes(modality?.name?.toString());
        });
        const mod_ids: Array<number> = [];
        filterModalities?.forEach((mod) => {
          mod_ids.push(mod?.id);
        });
        formik.setFieldValue("selectedModalities", mod_ids);
      }
      if (editedUser?.fse_accessible) {
        formik.setFieldValue(
          "accessToFSEFunctions",
          editedUser?.fse_accessible
        );
      }
      if (editedUser?.audit_enabled) {
        formik.setFieldValue("auditEnable", editedUser?.audit_enabled);
      }
      if (editedUser?.can_leave_notes) {
        formik.setFieldValue("possibilitytoLeave", editedUser?.can_leave_notes);
      }
      if (editedUser?.view_only) {
        formik.setFieldValue("viewOnly", editedUser?.view_only);
      }
      if (editedUser?.is_one_time) {
        formik.setFieldValue("oneTimeLinkCreation", editedUser?.is_one_time);
      }
      if (editedUser?.documentation_url) {
        formik.setFieldValue("docLink", editedUser?.documentation_url);
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
    const val = parseInt(e.target.value);
    if (formik.values.selectedSites.indexOf(val) > -1) {
      formik.values.selectedSites?.splice(
        formik.values.selectedSites?.indexOf(val),
        1
      );
      formik.setFieldValue("selectedSites", [...formik.values.selectedSites]);
    } else {
      formik.setFieldValue("selectedSites", [
        ...formik.values.selectedSites,
        val,
      ]);
    }
  };

  const handleSelectedModalities = (event, newFormats) => {
    formik.setFieldValue("selectedModalities", newFormats);
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
            .catch(() => {
              toast.error("User with this username already exists.", {
                autoClose: 2000,
                pauseOnHover: false,
              });
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
        if (error?.status < 500) {
          const metaError = error.data.meta
            ? Object.keys(error.data.meta)[0] +
              ": " +
              error.data.meta[Object.keys(error.data.meta)[0]][0]
            : error.data[Object.keys(error.data)[0]][0];
          toast.error(metaError, {
            autoClose: 2000,
            pauseOnHover: false,
          });
        } else {
          toast.error("Error occurred while saving user");
        }
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
        title: "User Profile Image",
      },
      first_name: formik.values.firstname,
      last_name: formik.values.lastname,
      email: formik.values.email,
      phone: "+1" + formik.values.phone,
      role: formik.values.role,
      organization: formik.values.customer,
      sites: formik.values.selectedSites,
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
    if (props?.action == "add") {
      formik.resetForm();
      formik.setFieldValue("userProfileImage", selectedImage[0]);
      if (usersData?.length) {
        formik.setFieldValue("manager", usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        formik.setFieldValue("customer", props?.organizationData[0]?.id);
      }
    } else if (props?.action == "edit") {
      populateEditableData();
      formik.resetForm();
      formik.setFieldValue("userProfileImage", selectedImage[0]);
    }
    props?.handleClose();
  };

  const moveToNextPage = async () => {
    const errors = await formik.validateForm();
    if (!Object.keys(errors).length) {
      await setPage("2");
    } else {
      setOnChangeValidation(true);
    }
  };

  return (
    <Dialog className="users-modal" open={props.open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section title-cross">
          <span className="modal-header">
            {!props?.selectedUser ? addNewUser : "Edit User"}
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
                <p className="info-label required">Profile Image</p>
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
                    {formik.errors.phone}
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
                    <span className="info-label">Sites</span>
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
                      Health Network Access
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
                        {item?.sites?.map((site, key) => (
                          <FormGroup
                            key={key}
                            style={{ marginLeft: "20px" }}
                            className="options"
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  onChange={handleSitesSelection}
                                  checked={formik.values.selectedSites.includes(
                                    site?.id
                                  )}
                                  value={site?.id}
                                  name={site?.address}
                                  color="primary"
                                />
                              }
                              label={site?.address}
                            />
                          </FormGroup>
                        ))}
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
                        Organization Sites
                      </span>
                    </p>
                    <div className="network-details">
                      {organizationSitesData?.map((site, key) => (
                        <FormGroup
                          key={key}
                          style={{ marginLeft: "20px" }}
                          className="options"
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={handleSitesSelection}
                                checked={formik.values.selectedSites.includes(
                                  site?.id
                                )}
                                value={site?.id}
                                name={site?.address}
                                color="primary"
                              />
                            }
                            label={site?.address}
                          />
                        </FormGroup>
                      ))}
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
              <div>
                {props?.modalitiesList?.length ? (
                  <p className="modalities-header">
                    <span className="info-label">Access to modalities</span>
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
                    props?.modalitiesList?.map((item, key) => (
                      <ToggleButton
                        key={key}
                        value={item?.id}
                        className="toggle-btn"
                      >
                        {item?.name}
                      </ToggleButton>
                    ))}
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
      <DialogActions>
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
