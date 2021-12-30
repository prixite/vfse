import { useState } from "react";

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

import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import NumberIcon from "@src/assets/svgs/number.svg";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";
import "@src/components/common/Smart/AddUser/AddUser.scss";
import { Organization } from "@src/store/reducers/api";

const mockData = {
  healthNetworks: [
    {
      name: "Advent Health",
      locations: ["loc1", "loc2", "loc3", "loc4"],
    },
    {
      name: "Nova Health",
      locations: ["loc1", "loc2", "loc3", "loc4"],
    },
    {
      name: "Super Health",
      locations: ["loc1", "loc2", "loc3", "loc4"],
    },
  ],
  modalities: [
    "CT",
    "MAMMO",
    "US",
    "XR",
    "SPECT",
    "PEM",
    "RGS",
    "USS",
    "XRR",
    "SPECTT",
    "PEMM",
    "RGSS",
  ],
};

interface Props {
  add: (arg: { username: string; email: string }) => void;
  open: boolean;
  handleClose: () => void;
  organization: Organization;
}

export default function AddUser(props: Props) {
  const [role, setRole] = useState(10);
  const [manager, setManager] = useState(10);
  const [customer, setCustomer] = useState(10);
  const [page, setPage] = useState("1");
  const [data, setData] = useState(mockData);
  console.log(setData); // eslint-disable-line no-console
  const [formats, setFormats] = useState([]);
  const constantData: object = localizedData()?.users?.popUp;
  const {
    addNewUser,
    pageTrackerdesc1,
    pageTrackerdesc2,
    btnCancel,
    btnNext,
    btnClient,
    userFirstName,
    userLastName,
    userEmail,
    userPhoneNumber,
    userRole,
    userManager,
    userCustomer,
  } = constantData;
  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const handleChange = (event) => {
    setPage(event.target.value);
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

  const handleCheckChange = () => {
    return null;
  };

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  return (
    <Dialog
      className="users-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">
            {props.organization?.name ?? addNewUser}
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
                />
                <Radio
                  checked={page === "2"}
                  onChange={handleChange}
                  value="2"
                  name="radio-buttons"
                  inputProps={{ "aria-label": "2" }}
                  size="small"
                />
              </span>
            </span>
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
          {page === "1" ? (
            <>
              <div>
                <p className="info-label">{userFirstName}</p>
                <TextField
                  className="full-field"
                  variant="outlined"
                  placeholder="Default"
                />
              </div>
              <div>
                <p className="info-label">{userLastName}</p>
                <TextField
                  className="full-field"
                  variant="outlined"
                  placeholder="Default"
                />
              </div>
              <div className="divided-div">
                <div>
                  <p className="info-label">{userEmail}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    placeholder="Default"
                  />
                </div>
                <div>
                  <p className="info-label">{userPhoneNumber}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <img src={NumberIcon} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              </div>
              <div className="divided-div">
                <div>
                  <p className="info-label">{userRole}</p>
                  <FormControl sx={{ minWidth: 356 }}>
                    <Select
                      value={role}
                      inputProps={{ "aria-label": "Without label" }}
                      style={{ height: "43px", borderRadius: "8px" }}
                      onChange={handleRoleChange}
                    >
                      <MenuItem value={10}>FSE</MenuItem>
                      <MenuItem value={20}>Adminitrator</MenuItem>
                      <MenuItem value={30}>Manager</MenuItem>
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
                    >
                      <MenuItem value={10}>Default</MenuItem>
                      <MenuItem value={20}>Font 2</MenuItem>
                      <MenuItem value={30}>Font 3</MenuItem>
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
                  >
                    <MenuItem value={10}>Crothall</MenuItem>
                    <MenuItem value={20}>Font 2</MenuItem>
                    <MenuItem value={30}>Font 3</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="info-label">Health Network Access</p>
                {data.healthNetworks.map((item, key) => (
                  <div key={key}>
                    <details className="network-details">
                      <summary className="header">
                        <span className="title">{item.name}</span>
                        <span className="checked-ratio">{`0/${item.locations.length}`}</span>
                      </summary>
                      {item.locations.map((loc, key) => (
                        <FormGroup
                          key={key}
                          style={{ marginLeft: "20px" }}
                          className="options"
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                onChange={handleCheckChange}
                                name={loc}
                                color="primary"
                              />
                            }
                            label={loc}
                          />
                        </FormGroup>
                      ))}
                    </details>
                  </div>
                ))}
              </div>
              <div>
                <p className="modalities-header">
                  <span className="info-label">Access to modalities</span>
                  <span className="checked-ratio">{`0/${data.modalities.length}`}</span>
                </p>
                <ToggleButtonGroup
                  value={formats}
                  onChange={handleFormat}
                  aria-label="text formatting"
                  style={{ flexWrap: "wrap" }}
                >
                  {data.modalities.map((item, key) => (
                    <ToggleButton key={key} value={item} className="toggle-btn">
                      {item}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </div>
              <div className="services">
                <FormGroup className="service-options">
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={handleCheckChange}
                        name="documentation"
                      />
                    }
                    label="Documentation link available"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={handleCheckChange} name="functions" />
                    }
                    label="Access to FSE functions"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={handleCheckChange} name="audit" />
                    }
                    label="Audit enable"
                  />
                </FormGroup>

                <FormGroup className="options">
                  <FormControlLabel
                    control={
                      <Checkbox onChange={handleCheckChange} name="notes" />
                    }
                    label="Possibility to leave notes"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={handleCheckChange} name="view" />
                    }
                    label="View only"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox onChange={handleCheckChange} name="link" />
                    }
                    label="One-time link creation"
                  />
                </FormGroup>
              </div>
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          style={{
            backgroundColor: buttonBackground,
            color: buttonTextColor,
          }}
          onClick={props.handleClose}
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
            onClick={() => setPage("2")}
            className="add-btn"
          >
            {btnNext}
          </Button>
        ) : (
          <Button
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
            // onClick={handleSetNewOrganization}
            className="add-btn"
          >
            {btnClient}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
