import TextField from "@mui/material/TextField";
import DropzoneBox from "@src/components/common/Presentational/DropzoneBox/DropzoneBox";
import ColorPicker from "@src/components/common/Presentational/ColorPicker/ColorPicker";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import "@src/components/common/Presentational/HealthNetwork/HealthNetwork.scss";
import { localizedData } from "@src/helpers/utils/language";

const HealthNetwork = () => {
  const {
    sideBarBackground,
    buttonBackground,
    sideBarTextColor,
    buttonTextColor,
  } = useAppSelector((state) => state.myTheme);
  const dispatch = useAppDispatch();
  const constantData: object = localizedData()?.healthNetwork;
  const { name, logo, color1, color2, color3, color4 } = constantData;

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

  return (
    <div className="health-section">
      <p className="info-label">{name}</p>
      <TextField
        className="info-field"
        variant="outlined"
        placeholder="Advent Health"
      />
      <div className="health-info">
        <div style={{ width: "46%", marginTop: "25px" }}>
          <p className="dropzone-title">{logo}</p>
          <DropzoneBox />
        </div>
        <div className="color-section">
          <div className="color-pickers">
            <div style={{ marginTop: "25px", marginRight: "15px" }}>
              <ColorPicker
                title={color1}
                color={sideBarBackground}
                onChange={changeSideBarColor}
              />
            </div>
            <div style={{ marginTop: "25px", marginRight: "15px" }}>
              <ColorPicker
                title={color2}
                color={buttonBackground}
                onChange={changeButtonColor}
              />
            </div>
          </div>
          <div className="color-pickers">
            <div style={{ marginTop: "25px", marginRight: "15px" }}>
              <ColorPicker
                title={color3}
                color={sideBarTextColor}
                onChange={changeSideBarTextColor}
              />
            </div>
            <div style={{ marginTop: "25px", marginRight: "15px" }}>
              <ColorPicker
                title={color4}
                color={buttonTextColor}
                onChange={changeButtonTextColor}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthNetwork;
