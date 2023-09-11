import { useState, useEffect, useCallback } from "react";

import {
  Box,
  Grid,
  TextField,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputAdornment,
} from "@mui/material";
import { Buffer } from "buffer";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import LoginImage from "@src/assets/images/loginImage.png";
import vfseLogo from "@src/assets/svgs/logo.svg";
import NumberIcon from "@src/assets/svgs/number.svg";
import DropzoneBox from "@src/components/common/presentational/dropzoneBox/DropzoneBox";
import { S3Interface } from "@src/helpers/interfaces/appInterfaces";
import { timeOut } from "@src/helpers/utils/constants";
import { uploadImageToS3 } from "@src/helpers/utils/imageUploadUtils";
import { toastAPIError } from "@src/helpers/utils/utils";
import SectionTwo from "@src/requests/src/components/smart/sectionTwo/SectionTwo";
import "@src/requests/src/registeration.scss";
import api, {
  useGetOrganizationsQuery,
  useGetRolesQuery,
  useGetManagersQuery,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsSitesListQuery,
  useOrganizationsModalitiesListQuery,
} from "@src/requests/src/store/reducers/api";
import { UserRequestAccess } from "@src/store/reducers/generatedWrapper";

window.Buffer = window.Buffer || Buffer;

const emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; // eslint-disable-line

const Registeration = () => {
  const [selectedImage, setSelectedImage] = useState([]);
  const [imageError, setImageError] = useState("");
  const [page, setPage] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [firstnameError, setFirstNameError] = useState("");
  const [lastName, setLastName] = useState("");
  const [lastnameError, setLastNameError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [docLink, setDocLink] = useState<boolean>(false);
  const [possibilitytoLeave, setPossibilitytoLeave] = useState<boolean>(false);
  const [accessToFSEFunctions, setAccessToFSEFunctions] =
    useState<boolean>(false);
  const [viewOnly, setViewOnly] = useState<boolean>(false);
  const [auditEnable, setAuditEnable] = useState<boolean>(false);
  const [oneTimeLinkCreation, setOneTimeLinkCreation] =
    useState<boolean>(false);

  const [organizationId, setOrganizationId] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [manager, setManager] = useState<string>("");
  const [selectedSites, setSelectedSites] = useState([]);
  const [selectedModalities, setSelectedModalities] = useState([]);
  const { data: userRoles = [] } = useGetRolesQuery();
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const { data: managers = [] } = useGetManagersQuery(
    { organizationId },
    {
      skip: !organizationId,
    }
  );
  const { data: HealthNetworks = [] } = useOrganizationsHealthNetworksListQuery(
    { organizationId },
    {
      skip: !organizationId,
    }
  );
  const { data: organizationSites = [] } = useOrganizationsSitesListQuery(
    { organizationId },
    {
      skip: !organizationId,
    }
  );
  const { data: modalitiesList = [] } = useOrganizationsModalitiesListQuery(
    { organizationId },
    {
      skip: !organizationId,
    }
  );

  const [register] = api.useSendAccessRequestMutation();

  const constructObject = (imageUrl: string) => {
    const obj = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: "+1" + phone,
      role: role as UserRequestAccess["role"],
      organization: parseInt(organizationId),
      sites: selectedSites,
      modalities: selectedModalities,
      fse_accessible: accessToFSEFunctions,
      audit_enabled: auditEnable,
      can_leave_notes: possibilitytoLeave,
      view_only: viewOnly,
      health_networks: [],
      is_one_time: oneTimeLinkCreation,
      documentation_url: docLink,
    };
    if (imageUrl) {
      obj["meta"] = {
        profile_picture: imageUrl,
        title: "User Profile Image",
      };
    }
    if (manager !== "") {
      obj["manager"] = parseInt(manager);
    }
    return obj;
  };

  const onSubmit = useCallback(async () => {
    const imageURL = await uploadImageToS3(selectedImage[0])
      .then((data: S3Interface) => {
        return data?.location;
      })
      .catch(() => {
        return "";
      });

    const UserObject = constructObject(imageURL);
    await register({
      ...UserObject,
    })
      .unwrap()
      .then(() => {
        toast.success("Registered Successfully.");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setSelectedImage([]);
        setDocLink(false);
        setPossibilitytoLeave(false);
        setAccessToFSEFunctions(false);
        setViewOnly(false);
        setAuditEnable(false);
        setOneTimeLinkCreation(false);
        setOrganizationId("");
        setRole("");
        setManager("");
        setSelectedSites([]);
        setSelectedModalities([]);
        setPage(1);
      })
      .catch((err) => {
        toastAPIError(
          "Something went wrong. Please try again!",
          err.status,
          err.data
        );
      });
  }, [
    firstName,
    lastName,
    email,
    phone,
    role,
    manager,
    organizationId,
    accessToFSEFunctions,
    auditEnable,
    possibilitytoLeave,
    viewOnly,
    oneTimeLinkCreation,
    docLink,
    selectedModalities,
    selectedSites,
  ]);

  useEffect(() => {
    if (selectedImage?.length) {
      setImageError("");
    }
  }, [selectedImage]);
  useEffect(() => {
    if (organizations && organizations.length) {
      setOrganizationId(organizations[0]?.id.toString());
    }
  }, [organizations]);
  useEffect(() => {
    if (userRoles && userRoles.length) {
      setRole(userRoles[0]?.value);
    }
  }, [userRoles]);
  const handleFirstName = (e) => {
    setFirstNameError("");
    setFirstName(e.target.value);
  };
  const handleLastName = (e) => {
    setLastNameError("");
    setLastName(e.target.value);
  };
  const handleEmail = (e) => {
    if (emailReg.test(e.target.value) === true) {
      setEmailError("");
    }
    setEmail(e.target.value);
  };
  const handlePhone = (e) => {
    if (e.target.value.length === 10) {
      setPhoneError("");
    }
    setPhone(e.target.value);
  };
  const handleErrors = () => {
    !selectedImage.length
      ? setImageError("Image is not selected")
      : setImageError("");
    !firstName
      ? setFirstNameError("First Name is required.")
      : setFirstNameError("");
    !lastName
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
  const moveToNextPage = () => {
    handleErrors();
    if (
      selectedImage.length &&
      firstName.length &&
      lastName.length &&
      email?.length &&
      emailReg.test(email) == true &&
      phone?.length &&
      phone?.length == 10 &&
      role &&
      organizationId
    ) {
      setPage(2);
    }
  };
  return (
    <>
      <ToastContainer autoClose={timeOut} pauseOnHover={false} />
      <Box component="div" className="Registeration">
        <Box component="div" className="Registeration__Section">
          <div className="vfseLogo">
            <img src={vfseLogo} alt="vfseLogo" />
          </div>
          <div className="Form">
            <h2 className="title">Request Access to Client</h2>
            {page === 1 ? (
              <div className="info-section">
                <p className="dropzone-title required">Profile Image</p>
                <DropzoneBox
                  setSelectedImage={setSelectedImage}
                  selectedImage={selectedImage}
                />
                <p className="errorText">{imageError}</p>
                <p className="info-label required">First Name</p>
                <TextField
                  autoComplete="off"
                  className="info-field"
                  variant="outlined"
                  placeholder="First Name"
                  value={firstName}
                  onChange={handleFirstName}
                />
                <p className="errorText">{firstnameError}</p>
                <p className="info-label required">Last Name</p>
                <TextField
                  autoComplete="off"
                  className="info-field"
                  variant="outlined"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={handleLastName}
                />
                <p className="errorText">{lastnameError}</p>
                <div className="divided-div">
                  <div className="group">
                    <p className="info-label required">User Email</p>
                    <TextField
                      autoComplete="off"
                      className="info-field"
                      type="email"
                      variant="outlined"
                      placeholder="Email"
                      value={email}
                      onChange={handleEmail}
                    />
                    <p className="errorText">{emailError}</p>
                  </div>
                  <div className="group">
                    <p className="info-label required">Phone Number</p>
                    <TextField
                      autoComplete="off"
                      className="info-field"
                      variant="outlined"
                      type="number"
                      placeholder="1234567890"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={NumberIcon} />
                          </InputAdornment>
                        ),
                      }}
                      value={phone}
                      onChange={handlePhone}
                    />
                    <p className="errorText">{phoneError}</p>
                  </div>
                </div>
                <div className="divided-div">
                  <div className="group">
                    <p className="info-label required">Roles</p>
                    <FormControl className="info-field">
                      <Select
                        inputProps={{ "aria-label": "Without label" }}
                        style={{ height: "43px", borderRadius: "8px" }}
                        disabled={!userRoles.length}
                        defaultValue=""
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        className="info-field"
                        MenuProps={{
                          PaperProps: { style: { maxHeight: 250 } },
                        }}
                      >
                        {userRoles.map((item, key) => (
                          <MenuItem key={key} value={item.value}>
                            {item.title}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="group">
                    <p className="info-label">Manager</p>
                    <FormControl className="info-field">
                      <Select
                        inputProps={{ "aria-label": "Without label" }}
                        style={{ height: "43px", borderRadius: "8px" }}
                        defaultValue=""
                        displayEmpty
                        value={manager}
                        disabled={!managers.length}
                        MenuProps={{
                          PaperProps: { style: { maxHeight: 250 } },
                        }}
                        className="info-field"
                        onChange={(event) => setManager(event.target.value)}
                      >
                        <MenuItem value="">
                          <p>None</p>
                        </MenuItem>
                        {managers.map((item, key) => (
                          <MenuItem key={key} value={item.id}>
                            {`${item.first_name} ${item.last_name}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <p className="info-label required">Customer</p>
                <FormControl>
                  <Select
                    inputProps={{ "aria-label": "Without label" }}
                    style={{ height: "43px", borderRadius: "8px" }}
                    defaultValue=""
                    disabled={!organizations.length}
                    value={organizationId}
                    onChange={(event) => setOrganizationId(event.target.value)}
                    MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                  >
                    {organizations.map((item, key) => (
                      <MenuItem key={key} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            ) : (
              <SectionTwo
                docLink={docLink}
                setDocLink={setDocLink}
                possibilitytoLeave={possibilitytoLeave}
                setPossibilitytoLeave={setPossibilitytoLeave}
                accessToFSEFunctions={accessToFSEFunctions}
                setAccessToFSEFunctions={setAccessToFSEFunctions}
                viewOnly={viewOnly}
                setViewOnly={setViewOnly}
                auditEnable={auditEnable}
                setAuditEnable={setAuditEnable}
                oneTimeLinkCreation={oneTimeLinkCreation}
                setOneTimeLinkCreation={setOneTimeLinkCreation}
                organizationSites={organizationSites}
                HealthNetworks={HealthNetworks}
                modalitiesList={modalitiesList}
                selectedSites={selectedSites}
                setSelectedSites={setSelectedSites}
                selectedModalities={selectedModalities}
                setSelectedModalities={setSelectedModalities}
              />
            )}
            <>
              {page === 1 ? (
                <Box
                  component="div"
                  className="btn-group"
                  style={{ alignItems: "flex-end" }}
                >
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item={true} xs={12}>
                      <Button className="register-btn" onClick={moveToNextPage}>
                        Next
                      </Button>
                    </Grid>
                    <Grid item={true} xs={12} className="login-section">
                      <span>Already have an account?</span>
                      <Button
                        variant="text"
                        className="login-btn"
                        onClick={() =>
                          window.location.replace("/accounts/login/?next=/")
                        }
                      >
                        log in
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box component="div" className="btn-group">
                  <Button className="register-btn" onClick={() => setPage(1)}>
                    Back
                  </Button>
                  <Button className="register-btn" onClick={() => onSubmit()}>
                    Register
                  </Button>
                </Box>
              )}
            </>
          </div>
        </Box>
        <div className="CoverSection">
          <img src={LoginImage} alt="Login Image" />
        </div>
      </Box>
    </>
  );
};

export default Registeration;
