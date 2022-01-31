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
import { toast } from "react-toastify";

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import NumberIcon from "@src/assets/svgs/number.svg";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { localizedData } from "@src/helpers/utils/language";
import {
  addNewUserService,
  updateUserService,
} from "@src/services/userService";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/shared/popUps/UserModal/UserModal.scss";
import {
  HealthNetwork,
  Modality,
  Organization,
  useOrganizationsUsersCreateMutation,
  User,
  useUsersPartialUpdateMutation,
} from "@src/store/reducers/api";

interface Props {
  open: boolean;
  handleClose: () => void;
  selectedUser?: number;
  usersData?: Array<User>;
  roles: unknown;
  networksData?: Array<HealthNetwork>;
  organizationData?: Array<Organization>;
  modalitiesList?: Array<Modality>;
  refetch: () => void;
  action: string;
}

export default function UserModal(props: Props) {
  const [page, setPage] = useState("1");
  const [userProfileImage, setUserProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [imageError, setImageError] = useState("");
  const [firstname, setFirstName] = useState("");
  const [firstnameError, setFirstNameError] = useState("");
  const [lastname, setLastName] = useState("");
  const [lastnameError, setLastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [role, setRole] = useState(props?.roles[0]?.value);
  const [manager, setManager] = useState<number>();
  const [customer, setCustomer] = useState<number>();
  const [selectedModalities, setSelectedModalities] = useState([]);
  const [selectedSites, setSelectedSites] = useState([]);
  const [docLink, setDocLink] = useState<boolean>(false);
  const [possibilitytoLeave, setPossibilitytoLeave] = useState<boolean>(false);
  const [accessToFSEFunctions, setAccessToFSEFunctions] =
    useState<boolean>(false);
  const [viewOnly, setViewOnly] = useState<boolean>(false);
  const [auditEnable, setAuditEnable] = useState<boolean>(false);
  const [oneTimeLinkCreation, setOneTimeLinkCreation] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const constantData: object = localizedData()?.users?.popUp;
  const {
    addNewUser,
    pageTrackerdesc1,
    pageTrackerdesc2,
    btnCancel,
    btnNext,
    btnAddUser,
    btnEditUser,
    userFirstName,
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

  const emailReg =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; // eslint-disable-line

  const [createUser] = useOrganizationsUsersCreateMutation();
  const [updateUser] = useUsersPartialUpdateMutation();

  const selectedOrganization = useAppSelector(
    (state) => state.organization.selectedOrganization
  );

  useEffect(() => {
    if (props?.action == "add") {
      if (props?.usersData?.length) {
        setManager(props?.usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        setCustomer(props?.organizationData[0]?.id);
      }
    }
  }, []);

  useEffect(() => {
    if (props?.selectedUser && props?.action == "edit") {
      populateEditableData();
    }
  }, [props?.selectedUser]);

  useEffect(() => {
    if (selectedImage?.length) {
      setImageError("");
    }
  }, [selectedImage]);

  const populateEditableData = () => {
    const editedUser: User = props?.usersData?.filter((user) => {
      return user?.id == props?.selectedUser;
    })[0];
    if (editedUser) {
      if (editedUser?.image?.length) {
        setUserProfileImage(editedUser?.image);
      }
      setFirstName(editedUser?.first_name);
      setLastName(editedUser?.last_name);
      setEmail(editedUser?.email);
      if (editedUser?.phone?.length && editedUser?.phone?.indexOf("+1") > -1) {
        setPhone(editedUser?.phone?.substring(2));
      }
      if (editedUser?.role?.length) {
        setRole(editedUser?.role[0]);
      }
      if (editedUser?.manager) {
        setManager(
          props?.usersData?.filter((user) => {
            return user?.email?.toString() == editedUser?.email?.toString();
          })[0]?.id
        );
      }
      if (editedUser?.organizations?.length) {
        setCustomer(
          props?.organizationData?.filter((org) => {
            return (
              org?.name?.toString() == editedUser?.organizations[0]?.toString()
            );
          })[0]?.id
        );
      }
      if (editedUser?.sites) {
        const sites_ids: Array<number> = [];
        props?.networksData?.forEach((item) => {
          item?.sites?.length &&
            item?.sites?.forEach((site) => {
              editedUser?.sites?.forEach((newSite) => {
                if (newSite == site?.name) {
                  sites_ids.push(site?.id);
                }
              });
            });
        });
        if (sites_ids?.length == editedUser?.sites?.length) {
          setSelectedSites(sites_ids);
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
        setSelectedModalities(mod_ids);
      }
      if (editedUser?.fse_accessible) {
        setAccessToFSEFunctions(editedUser?.fse_accessible);
      }
      if (editedUser?.audit_enabled) {
        setAuditEnable(editedUser?.audit_enabled);
      }
      if (editedUser?.can_leave_notes) {
        setPossibilitytoLeave(editedUser?.can_leave_notes);
      }
      if (editedUser?.view_only) {
        setViewOnly(editedUser?.view_only);
      }
      if (editedUser?.is_one_time) {
        setOneTimeLinkCreation(editedUser?.is_one_time);
      }
      if (editedUser?.documentation_url) {
        setDocLink(editedUser?.documentation_url);
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

  const handleFirstName = (event) => {
    if (event.target.value.length) {
      setFirstNameError("");
    }
    setFirstName(event?.target?.value);
  };

  const handleLastName = (event) => {
    if (event.target.value.length) {
      setLastNameError("");
    }
    setLastName(event?.target?.value);
  };

  const handleEmail = (event) => {
    if (
      event.target.value.length &&
      emailReg.test(event.target.value) == true
    ) {
      setEmailError("");
    }
    setEmail(event?.target?.value);
  };

  const handlePhone = (event) => {
    if (event?.target?.value?.length == 10) {
      setPhoneError("");
    }
    setPhone(event?.target?.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const handleManagerChange = (event) => {
    setManager(event.target.value);
  };

  const handleCustomerChange = (event) => {
    setCustomer(event.target.value);
  };

  const handleSitesSelection = (e) => {
    const val = parseInt(e.target.value);
    if (selectedSites.indexOf(val) > -1) {
      selectedSites?.splice(selectedSites?.indexOf(val), 1);
      setSelectedSites([...selectedSites]);
    } else {
      setSelectedSites([...selectedSites, parseInt(e.target.value)]);
    }
  };

  const sitesLength = () => {
    let count = 0;
    props?.networksData?.forEach((item) => {
      if (item?.sites?.length) {
        count += item?.sites?.length;
      }
    });
    return count;
  };

  const handleSelectedModalities = (event, newFormats) => {
    setSelectedModalities(newFormats);
  };

  const handleAddUser = async () => {
    setIsLoading(true);
    handleErrors();
    if (verifyErrors()) {
      await uploadImageToS3(selectedImage[0]).then(
        async (data: S3Interface) => {
          const userObject = getUserObject(data?.location);
          await addNewUserService(
            selectedOrganization.id,
            userObject,
            createUser,
            props?.refetch
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
    handleErrors();
    if (verifyErrors()) {
      if (!selectedImage.length && userProfileImage?.length) {
        performEditUser(userProfileImage);
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
    await updateUserService(
      props?.selectedUser,
      userObject,
      updateUser,
      props?.refetch
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
  };

  const getUserObject = (imageUrl: string) => {
    return {
      memberships: [constructObject(imageUrl)],
    };
  };

  const constructObject = (imageUrl: string) => {
    return {
      meta: {
        profile_picture: imageUrl,
        title: "User Profile Image",
      },
      first_name: firstname,
      last_name: lastname,
      email: email,
      phone: "+1" + phone,
      role: role,
      manager: manager,
      organization: customer,
      sites: selectedSites,
      modalities: selectedModalities,
      fse_accessible: accessToFSEFunctions,
      audit_enabled: auditEnable,
      can_leave_notes: possibilitytoLeave,
      view_only: viewOnly,
      is_one_time: oneTimeLinkCreation,
      documentation_url: docLink,
    };
  };

  const resetModal = () => {
    if (props?.action == "add") {
      setPage("1");
      setUserProfileImage("");
      setSelectedImage([]);
      setImageError("");
      setFirstName("");
      setFirstNameError("");
      setLastName("");
      setLastNameError("");
      setEmail("");
      setEmailError("");
      setPhone("");
      setPhoneError("");
      setRole(props?.roles[0]?.value);
      if (props?.usersData?.length) {
        setManager(props?.usersData[0]?.id);
      }
      if (props?.organizationData?.length) {
        setCustomer(props?.organizationData[0]?.id);
      }
      setSelectedSites([]);
      setSelectedModalities([]);
      setDocLink(false);
      setPossibilitytoLeave(false);
      setAccessToFSEFunctions(false);
      setViewOnly(false);
      setAuditEnable(false);
      setOneTimeLinkCreation(false);
    } else if (props?.action == "edit") {
      populateEditableData();
      setImageError("");
      setFirstNameError("");
      setLastNameError("");
      setEmailError("");
      setPhoneError("");
    }
    props?.handleClose();
  };

  const moveToNextPage = () => {
    handleErrors();
    if (
      (selectedImage.length || userProfileImage.length) &&
      firstname.length &&
      lastname.length &&
      email?.length &&
      emailReg.test(email) == true &&
      phone?.length &&
      phone?.length == 10 &&
      role?.length &&
      manager &&
      customer
    ) {
      setPage("2");
    }
  };

  const verifyErrors = () => {
    if (
      (selectedImage.length || userProfileImage.length) &&
      firstname &&
      lastname &&
      email?.length &&
      emailReg.test(email) == true &&
      phone?.length &&
      phone?.length == 10 &&
      role &&
      manager &&
      customer
    ) {
      return true;
    }
    return false;
  };

  const handleErrors = () => {
    !userProfileImage.length && !selectedImage.length
      ? setImageError("Image is not selected")
      : setImageError("");
    !firstname
      ? setFirstNameError("First Name is required.")
      : setFirstNameError("");
    !lastname
      ? setLastNameError("Last Name is required.")
      : setLastNameError("");
    !email
      ? setEmailError("Email is required.")
      : emailReg.test(email) == false
      ? setEmailError("Invalid Email.")
      : setEmailError("");
    !phone
      ? setPhoneError("Phone number is required.")
      : phone?.length !== 10
      ? setPhoneError("Phone number is incorrect.")
      : setPhoneError("");
  };

  return (
    <Dialog className="users-modal" open={props.open} onClose={resetModal}>
      <DialogTitle>
        <div className="title-section">
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
            <img src={CloseBtn} className="cross-btn" onClick={resetModal} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="modal-content">
          {page === "1" ? (
            <>
              <div>
                <p className="info-label">Profile Image</p>
                <DropzoneBox
                  imgSrc={userProfileImage}
                  setSelectedImage={setSelectedImage}
                  selectedImage={selectedImage}
                />
                {imageError?.length ? (
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {imageError}
                  </p>
                ) : (
                  ""
                )}
              </div>
              <div>
                <p className="info-label">{userFirstName}</p>
                <TextField
                  className="full-field"
                  value={firstname}
                  type="text"
                  onChange={handleFirstName}
                  variant="outlined"
                  placeholder="First Name"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {firstnameError}
                </p>
              </div>
              <div>
                <p className="info-label">{userLastName}</p>
                <TextField
                  className="full-field"
                  type="text"
                  value={lastname}
                  onChange={handleLastName}
                  variant="outlined"
                  placeholder="Last Name"
                />
                <p className="errorText" style={{ marginTop: "5px" }}>
                  {lastnameError}
                </p>
              </div>
              <div className="divided-div">
                <div>
                  <p className="info-label">{userEmail}</p>
                  <TextField
                    className="info-field"
                    type="email"
                    value={email}
                    onChange={handleEmail}
                    variant="outlined"
                    placeholder="Email"
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {emailError}
                  </p>
                </div>
                <div>
                  <p className="info-label">{userPhoneNumber}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    value={phone}
                    type="number"
                    onChange={handlePhone}
                    placeholder="1234567890"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={NumberIcon} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <p className="errorText" style={{ marginTop: "5px" }}>
                    {phoneError}
                  </p>
                </div>
              </div>
              <div className="divided-div">
                <div>
                  <p className="info-label">{userRole}</p>
                  <FormControl sx={{ minWidth: 356 }}>
                    <Select
                      value={role}
                      disabled={!props?.roles?.length}
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "43px", borderRadius: "8px" }}
                      defaultValue="none"
                      onChange={handleRoleChange}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                    >
                      {props?.roles?.map((item, key) => (
                        <MenuItem key={key} value={item.value}>
                          {item.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <p className="info-label">{userManager}</p>
                  <FormControl sx={{ minWidth: 356 }}>
                    <Select
                      value={manager}
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "43px", borderRadius: "8px" }}
                      onChange={handleManagerChange}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                    >
                      {props?.usersData?.map((item, key) => (
                        <MenuItem key={key} value={item?.id}>
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
                    value={customer}
                    inputProps={{ "aria-label": "Without label" }}
                    style={{ height: "43px", borderRadius: "8px" }}
                    onChange={handleCustomerChange}
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
                {sitesLength() > 0 && (
                  <p className="modalities-header">
                    <span className="info-label">Health Network Access</span>
                    <span className="checked-ratio">{`${
                      selectedSites?.length
                    }/${sitesLength()}`}</span>
                  </p>
                )}
                {props?.networksData?.map((item, key) =>
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
                                  checked={selectedSites.includes(site?.id)}
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
              </div>
              <div>
                {props?.modalitiesList?.length && (
                  <p className="modalities-header">
                    <span className="info-label">Access to modalities</span>
                    <span className="checked-ratio">{`${selectedModalities?.length}/${props?.modalitiesList?.length}`}</span>
                  </p>
                )}
                <ToggleButtonGroup
                  value={selectedModalities}
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
                        checked={docLink}
                        onClick={() => setDocLink(!docLink)}
                      />
                    }
                    label="Documentation Link Available"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={accessToFSEFunctions}
                        onClick={() =>
                          setAccessToFSEFunctions(!accessToFSEFunctions)
                        }
                      />
                    }
                    label="Access to FSE functions"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={auditEnable}
                        onClick={() => setAuditEnable(!auditEnable)}
                      />
                    }
                    label="Audit Enable"
                  />
                </FormGroup>

                <FormGroup className="options">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={possibilitytoLeave}
                        onClick={() =>
                          setPossibilitytoLeave(!possibilitytoLeave)
                        }
                      />
                    }
                    label="Possibility to Leave Notes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={viewOnly}
                        onClick={() => setViewOnly(!viewOnly)}
                      />
                    }
                    label="View Only"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={oneTimeLinkCreation}
                        onClick={() =>
                          setOneTimeLinkCreation(!oneTimeLinkCreation)
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
            onClick={props?.action === "add" ? handleAddUser : handleEditUser}
            className="add-btn"
          >
            {props?.action == "add" ? btnAddUser : btnEditUser}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
