import { useState, useEffect } from "react";

import {
  Box,
  TextField,
  MenuItem,
  Select,
  Button,
  FormControl,
  InputAdornment,
} from "@mui/material";

import LoginImage from "@src/assets/images/loginImage.png";
import vfseLogo from "@src/assets/svgs/logo.svg";
import NumberIcon from "@src/assets/svgs/number.svg";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import SectionTwo from "@src/requests/src/components/Smart/SectionTwo/SectionTwo";
import "@src/requests/src/Registeration.scss";
import {
  useGetOrganizationsQuery,
  useGetRolesQuery,
  useGetManagersQuery,
  useOrganizationsHealthNetworksListQuery,
  useOrganizationsSitesListQuery,
} from "@src/requests/src/store/reducers/api";

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
  const [role, setRole] = useState("");
  const [manager, setManager] = useState<string>("");
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
  useEffect(() => {
    if (managers && managers.length) {
      setManager(managers[1].id.toString());
    }
  }, [managers]);
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
                className="info-field"
                variant="outlined"
                placeholder="First Name"
                value={firstName}
                onChange={handleFirstName}
              />
              <p className="errorText">{firstnameError}</p>
              <p className="info-label required">Last Name</p>
              <TextField
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
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
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
                      value={manager}
                      disabled={!managers.length}
                      MenuProps={{ PaperProps: { style: { maxHeight: 250 } } }}
                      className="info-field"
                      onChange={(event) => setManager(event.target.value)}
                    >
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
            />
          )}
          <>
            {page === 1 ? (
              <Button className="register-btn" onClick={moveToNextPage}>
                Next
              </Button>
            ) : (
              <Box component="div" className="btn-group">
                <Button className="register-btn" onClick={() => setPage(1)}>
                  Back
                </Button>
                <Button className="register-btn">Register</Button>
              </Box>
            )}
          </>
        </div>
      </Box>
      <div className="CoverSection">
        <img src={LoginImage} alt="Login Image" />
      </div>
    </Box>
  );
};

export default Registeration;
