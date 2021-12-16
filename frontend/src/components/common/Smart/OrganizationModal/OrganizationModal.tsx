import { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Radio from '@mui/material/Radio';
import CloseBtn from "@src/assets/svgs/cross-icon.svg";
import AddBtn from "@src/assets/svgs/add.svg";
import "@src/components/common/Smart/OrganizationModal/OrganizationModal.scss";
import { toast } from "react-toastify";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import HealthNetwork from "@src/components/common/Presentational/HealthNetwork/HealthNetwork";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
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
  const [addNewOrganization, { isLoading }] = useOrganizationsCreateMutation();
  const [updateOrganization] = useOrganizationsPartialUpdateMutation();
  const constantData: object = localizedData()?.organization?.popUp;
  const {
    popUpNewOrganization,
    newOrganizationName,
    newOrganizationSeats,
    newOrganizationBtnSave,
    newOrganizationBtnCancel,
  } = constantData;
  const {
    sideBarBackground,
    buttonBackground,
    sideBarTextColor,
    buttonTextColor,
  } = useAppSelector((state) => state.myTheme);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState("1");

  const handleChange = (event) => {
    setPage(event.target.value);
  };

  function changeSideBarColor(color: string) {
    dispatch(updateSideBarColor(color));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      color,
      "sidebar_color"
    );
    dispatch(
      setCurrentOrganization({
        currentOrganization: currentOrganiationDummyData,
      })
    );
    updateOrganizationColor(
      organizationsPartialUpdate,
      currentOrganiationDummyData
    );
  }

  function changeButtonColor(color: string) {
    dispatch(updateButtonColor(color));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      color,
      "primary_color"
    );
    dispatch(
      setCurrentOrganization({
        currentOrganization: currentOrganiationDummyData,
      })
    );
    updateOrganizationColor(
      organizationsPartialUpdate,
      currentOrganiationDummyData
    );
  }

  function changeSideBarTextColor(color: string) {
    dispatch(updateSideBarTextColor(color));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      color,
      "sidebar_text"
    );
    dispatch(
      setCurrentOrganization({
        currentOrganization: currentOrganiationDummyData,
      })
    );
    updateOrganizationColor(
      organizationsPartialUpdate,
      currentOrganiationDummyData
    );
  }

  function changeButtonTextColor(color: string) {
    dispatch(updateButtonTextColor(color));
    currentOrganiationDummyData = compileOrganizationColorObject(
      currentOrganiationDummyData,
      color,
      "button_text"
    );
    dispatch(
      setCurrentOrganization({
        currentOrganization: currentOrganiationDummyData,
      })
    );
    updateOrganizationColor(
      organizationsPartialUpdate,
      currentOrganiationDummyData
    );
  }

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

  return (
    <Dialog className="organization-modal" open={props.open} onClose={props.handleClose}>
      <DialogTitle>
        <div className="title-section">
          <span className="modal-header">{props.organization?.name ?? popUpNewOrganization}</span> 
          <span className="dialog-page">
            <span className="pg-number">
              Step 1 of 2 
              <span style={{ marginLeft: "16px" }}>
                <Radio
                  checked={page === "1"}
                  onChange={handleChange}
                  value="1"
                  name="radio-buttons"
                  inputProps={{ 'aria-label': "1" }}
                  size="small"
                />
                <Radio
                  checked={page === "2"}
                  onChange={handleChange}
                  value="2"
                  name="radio-buttons"
                  inputProps={{ 'aria-label': '2' }}
                  size="small"
                />
              </span>
            </span>
            <img src={CloseBtn} className="cross-btn" onClick={props.handleClose} />
          </span>
        </div>
      </DialogTitle>
      <DialogContent>
      <div className="modal-content">
      { page === '1' ?
        <>
          <div>
            <p className="dropzone-title">Logo</p>
            <DropzoneBox />
          </div>
          <div className="client-info">
            <div className="info-section">
              <p className="info-label">Client Name...</p>
              <TextField
                className="info-field"
                variant="outlined"
                placeholder="Advent Health"
              />
              <div className="color-section">
                <div className="color-pickers">
                  <div style={{ marginTop: "25px", marginRight: "24px" }}>
                    <ColorPicker
                      title="Sidebar:"
                      color={sideBarBackground}
                      onChange={changeSideBarColor}
                    />
                  </div>
                  <div style={{ marginTop: "25px", marginRight: "24px" }}>
                    <ColorPicker
                      title="Buttons:"
                      color={buttonBackground}
                      onChange={changeButtonColor}
                    />
                  </div>
                </div>
                <div className="color-pickers">
                  <div style={{ marginTop: "25px", marginRight: "24px" }}>
                    <ColorPicker
                      title="Sidebar Text:"
                      color={sideBarTextColor}
                      onChange={changeSideBarTextColor}
                    />
                  </div>
                  <div style={{ marginTop: "25px", marginRight: "24px" }}>
                    <ColorPicker
                      title="Buttons Text:"
                      color={buttonTextColor}
                      onChange={changeButtonTextColor}
                    />
                  </div>
                </div> 
              </div>
            </div>
            <div className="info-section">
              <p className="info-label">Number of Systems</p>
              <TextField
                className="info-field"
                variant="outlined"
                placeholder="6"
              />
            </div>
          </div>
        </> :
        <>
          <div className="health-header">
            <span className="heading-txt">Health Networks</span>
            <Button className="heading-btn">
              <img src={AddBtn} className="add-btn" />
              Add Network
            </Button>
          </div>
          <HealthNetwork />
        </>
      }
          
          
        </div>


        {/* <TextField
          autoFocus
          margin="dense"
          id="name"
          label={newOrganizationName}
          type="text"
          fullWidth
          value={props.organization?.name ?? ""}
          variant="standard"
          onChange={(event) =>
            props.setOrganization({
              ...props.organization,
              name: event.target.value,
            })
          }
        />
        <TextField
          margin="dense"
          id="seats"
          label={newOrganizationSeats}
          type="text"
          fullWidth
          variant="standard"
          value={props.organization?.number_of_seats ?? 0}
          onChange={(event) =>
            props.setOrganization({
              ...props.organization,
              number_of_seats: event.target.value,
            })
          }
        /> */}
      </DialogContent>
      <DialogActions>
          <Button onClick={props.handleClose} className="cancel-btn">{newOrganizationBtnCancel}</Button>
          <Button onClick={handleSetNewOrganization} className="add-btn" >
            {newOrganizationBtnSave}
          </Button>
      </DialogActions>
    </Dialog>
  );
}
