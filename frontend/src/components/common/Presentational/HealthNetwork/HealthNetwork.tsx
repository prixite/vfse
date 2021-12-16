import React from "react";
import TextField from "@mui/material/TextField";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import "@src/components/common/Presentational/HealthNetwork/HealthNetwork.scss"

const HealthNetwork = () => {
    const {
        sideBarBackground,
        buttonBackground,
        sideBarTextColor,
        buttonTextColor,
      } = useAppSelector((state) => state.myTheme);
    const dispatch = useAppDispatch();

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

    return(
        <div className="health-section">
            <p className="info-label">Health Network Name</p>
            <TextField
              className="info-field"
              variant="outlined"
              placeholder="Advent Health"
            />
            <div className="health-info">
              <div style={{width: "46%", marginTop: "25px"}}>
                <p className="dropzone-title">Logo</p>
                <DropzoneBox />
              </div>
              <div className="color-section">
                <div className="color-pickers">
                  <div style={{ marginTop: "25px", marginRight: "15px" }}>
                    <ColorPicker
                      title="Sidebar:"
                      color={sideBarBackground}
                      onChange={changeSideBarColor}
                    />
                  </div>
                  <div style={{ marginTop: "25px", marginRight: "15px" }}>
                    <ColorPicker
                      title="Buttons:"
                      color={buttonBackground}
                      onChange={changeButtonColor}
                    />
                  </div>
                </div>
                <div className="color-pickers">
                  <div style={{ marginTop: "25px", marginRight: "15px" }}>
                    <ColorPicker
                      title="Sidebar Text:"
                      color={sideBarTextColor}
                      onChange={changeSideBarTextColor}
                    />
                  </div>
                  <div style={{ marginTop: "25px", marginRight: "15px" }}>
                    <ColorPicker
                      title="Buttons Text:"
                      color={buttonTextColor}
                      onChange={changeButtonTextColor}
                    />
                  </div>
                </div> 
              </div>
            </div>
        </div>
    )

}

export default HealthNetwork;