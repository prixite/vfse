import { useState } from "react";
import { Box, TextField, Select, MenuItem, FormControl } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import AddBtn from "@src/assets/svgs/add.svg";
import "@src/components/shared/popUps/OrganizationModal/OrganizationModal.scss";
import { toast } from "react-toastify";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import HealthNetwork from "@src/components/common/Presentational/HealthNetwork/HealthNetwork";
import {
  useOrganizationsCreateMutation,
  useOrganizationsPartialUpdateMutation,
} from "@src/store/reducers/api";
import { localizedData } from "@src/helpers/utils/language";
import {
  updateOrganizationService,
  addNewOrganizationService,
} from "@src/services/organizationService";

export default function OrganizationModal(props) {
  const [addNewOrganization] = useOrganizationsCreateMutation();
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const [networks, setNetworks] = useState([1]);
  const constantData: object = localizedData()?.organization?.popUp;
  const {
    popUpNewOrganization,
    newOrganizationPageTrackerdesc1,
    newOrganizationPageTrackerdesc2,
    newOrganizationName,
    newOrganizationSeats,
    newOrganizationBtnSave,
    newOrganizationBtnCancel,
    newOrganizationLogo,
    newOrganizationFont1,
    newOrganizationFont2,
    newOrganizationHealthNetworks,
    newOrganizationAddNetwork,
  } = constantData;

  const [page, setPage] = useState("1");

  const handleChange = (event) => {
    setPage(event.target.value);
  };

  const handleSetNewOrganization = async () => {
    if (props.organization.id) {
      const { id, ...organization } = props.organization;
      await updateOrganizationService(
        id,
        organization,
        updateOrganization,
        props.refetch
      );
      toast.success("Organization successfully updated");
    } else {
      await addNewOrganizationService(
        props.organization,
        addNewOrganization,
        props.refetch
      );
      toast.success("Organization successfully added");
    }
    props.handleClose();
  };

  const addNetworks = () => {
    setNetworks([...networks, networks.length]);
  };

  return (
    <Dialog
      className="organization-modal"
      open={props.open}
      onClose={props.handleClose}
    >
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">
            {props.organization?.name ?? popUpNewOrganization}
          </span>
          <span className="dialog-page">
            <span className="pg-number">
              {`${newOrganizationPageTrackerdesc1} ${page} ${newOrganizationPageTrackerdesc2}`}
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
                <p className="dropzone-title">{newOrganizationLogo}</p>
                <DropzoneBox />
              </div>
              <div className="client-info">
                <div className="info-section">
                  <p className="info-label">{newOrganizationName}</p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    placeholder="Advent Health"
                  />
                  <p className="info-label" style={{ marginTop: "25px" }}>
                    {newOrganizationSeats}
                  </p>
                  <TextField
                    className="info-field"
                    variant="outlined"
                    placeholder="6"
                  />
                  <h4 style={{ marginTop: "25px" }} className="labels">
                    {newOrganizationFont1}
                  </h4>
                  <div className="font-options">
                    <Box component="div" className="font-section">
                      <FormControl sx={{ minWidth: 195 }}>
                        <Select
                          value=""
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Font 1</MenuItem>
                          <MenuItem value={20}>Font 2</MenuItem>
                          <MenuItem value={30}>Font 3</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <span className="font-demo">AaBbCcDd</span>
                  </div>
                  <h4 className="labels">{newOrganizationFont2}</h4>
                  <div className="font-options">
                    <Box component="div" className="font-section">
                      <FormControl sx={{ minWidth: 195 }}>
                        <Select
                          value=""
                          displayEmpty
                          inputProps={{ "aria-label": "Without label" }}
                          style={{ height: "48px", marginRight: "15px" }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value={10}>Font 1</MenuItem>
                          <MenuItem value={20}>Font 2</MenuItem>
                          <MenuItem value={30}>Font 3</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <span className="font-demo">AaBbCcDd</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="health-header">
                <span className="heading-txt">
                  {newOrganizationHealthNetworks}
                </span>
                <Button className="heading-btn" onClick={addNetworks}>
                  <img src={AddBtn} className="add-btn" />
                  {newOrganizationAddNetwork}
                </Button>
              </div>
              {networks.map((network) => (
                <HealthNetwork />
              ))}
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} className="cancel-btn">
          {newOrganizationBtnCancel}
        </Button>
        <Button onClick={handleSetNewOrganization} className="add-btn">
          {newOrganizationBtnSave}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
