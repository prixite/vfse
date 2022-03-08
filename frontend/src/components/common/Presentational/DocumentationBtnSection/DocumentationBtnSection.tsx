import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Grid, Button } from "@mui/material";

import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";
import { useAppSelector } from "@src/store/hooks";

interface btnProps {
  handleEditText: (val: boolean) => void;
  editText: boolean;
}

const DocumentationBtnSection = ({ editText, handleEditText }: btnProps) => {
  const localization: LocalizationInterface = localizedData();
  const { btnEdit, btnCopy } = localization.document;
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  return (
    <Grid container spacing={2} style={{ marginBottom: "20px" }}>
      <Grid item={true} xs={6}>
        {!editText ? (
          <Button
            className="btn"
            style={{
              backgroundColor: secondaryColor,
              color: buttonTextColor,
            }}
            onClick={() => handleEditText(true)}
          >
            <ModeEditOutlineOutlinedIcon style={{ marginRight: "10px" }} />
            <span>{btnEdit}</span>
          </Button>
        ) : (
          <Button
            className="btn"
            style={{
              backgroundColor: secondaryColor,
              color: buttonTextColor,
            }}
            onClick={() => handleEditText(false)}
          >
            <span>Cancel</span>
          </Button>
        )}
      </Grid>
      <Grid item={true} xs={6}>
        {!editText ? (
          <Button
            className="btn"
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
          >
            <InsertLinkOutlinedIcon
              style={{ transform: "rotate(120deg)", marginRight: "10px" }}
            />
            <span> {btnCopy} </span>
          </Button>
        ) : (
          <Button
            className="btn"
            style={{
              backgroundColor: buttonBackground,
              color: buttonTextColor,
            }}
          >
            <span> Update </span>
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export default DocumentationBtnSection;
