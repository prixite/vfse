import React from 'react'
import "@src/components/common/Smart/AppearanceSection/AppearanceSection.scss";
import { Box , TextField } from "@mui/material";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import { compileOrganizationColorObject } from "@src/helpers/compilers/organization";
import { Organization ,   useOrganizationsPartialUpdateMutation } from "@src/store/reducers/api";
import { useAppSelector,useAppDispatch } from "@src/store/hooks";
import {
    updateSideBarColor,
    updateButtonColor,
    updateSideBarTextColor,
    updateButtonTextColor,
  } from "@src/store/reducers/themeStore";
  import { setCurrentOrganization } from "@src/store/reducers/organizationStore";
  import { updateOrganizationColor } from "@src/services/organizationService";
const AppearanceSection = () => {
    const [organizationsPartialUpdate] = useOrganizationsPartialUpdateMutation();
    const dispatch = useAppDispatch();
    const currentOrganization = useAppSelector(
        (state) => state.organization.currentOrganization
      );
      const {
        sideBarBackground,
        buttonBackground,
        sideBarTextColor,
        buttonTextColor,
      } = useAppSelector((state) => state.myTheme); 

      var currentOrganiationDummyData: Organization = JSON.parse(
        JSON.stringify(currentOrganization)
      );
      const changeSideBarColor = (color: string) => {
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
      
      const changeButtonColor = (color: string) => {
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

      const changeSideBarTextColor = (color: string) => {
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

      const changeButtonTextColor = (color: string) => {
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

    return (
        <Box component="div" className="AppearanceSection">
           <h2>{currentOrganization?.name}</h2>
           <Box component="div" className="AppearanceSection__clientSection">
               <Box component="div" className="clientName">
                   <h4 className="labels">Client Name</h4>
                   <TextField disabled className="nameInput" placeholder={currentOrganization?.name} variant="outlined" />
               </Box>
               <Box component="div" className="clientTheming">
               <Box component="div" className="clientLogo">
                   <h4 className="labels">Logo</h4>
                   <Box component="div" className="logo"><img src={currentOrganization?.logo}/></Box>
               </Box>
                    <Box component="div" className="colorSection">
                <div style={{display:"flex"}}>
                    <div className="appearanceColorSection">
                    <ColorPicker
                    title="Sidebar:"
                    color={sideBarBackground}
                    onChange={changeSideBarColor}
                    />
                    </div>
                    <div className="appearanceColorSection">
                    <ColorPicker
                    title="Buttons:"
                    color={buttonBackground}
                    onChange={changeButtonColor}
                    />
                    </div>
                </div>
                <div style={{display:"flex"}}>
                    <div className="appearanceColorSection">
                    <ColorPicker
                    title="Sidebar Text:"
                    color={sideBarTextColor}
                    onChange={changeSideBarTextColor}
                    />
                    </div>
                    <div className="appearanceColorSection">
                    <ColorPicker
                    title="Buttons Text:"
                    color={buttonTextColor}
                    onChange={changeButtonTextColor}
                    />
                    </div>
                </div>
                </Box>
               </Box>
           </Box>
        </Box>
    )
}

export default AppearanceSection
