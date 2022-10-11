import { Component } from "react";

import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { Grid, Button } from "@mui/material";
import { toast } from "react-toastify";

import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { localizedData } from "@src/helpers/utils/language";
import {} from "@mui/icons-material";
import constantsData from "@src/localization/en.json";
import { useSelectedOrganization, useAppSelector } from "@src/store/hooks";
import { useOrganizationsMeReadQuery } from "@src/store/reducers/api";

interface btnProps {
  handleEditText: (val: boolean) => void;
  editText: boolean;
  saveText: () => void;
}

interface btncomponent {
  handleClick?: () => void;
  bgColor: string;
  btnTextColor: string;
  btnText: string;
  icon?: React.ReactElement<Component>;
}

const Btn = ({
  handleClick,
  bgColor,
  btnTextColor,
  btnText,
  icon,
}: btncomponent) => {
  return (
    <Button
      className="btn"
      style={{
        backgroundColor: bgColor,
        color: btnTextColor,
      }}
      onClick={handleClick}
    >
      {icon ? icon : icon}
      {btnText}
    </Button>
  );
};

const DocumentationBtnSection = ({
  editText,
  handleEditText,
  saveText,
}: btnProps) => {
  const localization: LocalizationInterface = localizedData();
  const { data: currentUser } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });
  const { btnEdit, btnCopy } = localization.document;
  const { toastData } = constantsData;
  const { buttonBackground, buttonTextColor, secondaryColor } = useAppSelector(
    (state) => state.myTheme
  );
  const edit = () => handleEditText(true);
  const cancelEdit = () => handleEditText(false);
  const copyLink = () => {
    navigator?.clipboard?.writeText(window.location.href);
    toast.success(toastData.documentationBtnLinkCopy, {
      autoClose: 1000,
      pauseOnHover: false,
    });
  };
  return (
    <Grid container spacing={1} style={{ marginBottom: "20px" }}>
      <Grid item={true} xs={6}>
        <>
          {!currentUser?.view_only ? (
            !editText ? (
              <Btn
                handleClick={edit}
                bgColor={secondaryColor}
                btnTextColor={buttonTextColor}
                btnText={btnEdit}
                icon={
                  <ModeEditOutlineOutlinedIcon
                    style={{ marginRight: "10px" }}
                  />
                }
              />
            ) : (
              <Btn
                handleClick={cancelEdit}
                bgColor={secondaryColor}
                btnTextColor={buttonTextColor}
                btnText={"Cancel"}
              />
            )
          ) : (
            ""
          )}
        </>
      </Grid>
      <Grid item={true} xs={6}>
        {!editText ? (
          <Btn
            bgColor={buttonBackground}
            btnTextColor={buttonTextColor}
            btnText={btnCopy}
            handleClick={copyLink}
            icon={
              <InsertLinkOutlinedIcon
                style={{ transform: "rotate(120deg)", marginRight: "10px" }}
              />
            }
          />
        ) : (
          <Btn
            handleClick={saveText}
            bgColor={buttonBackground}
            btnTextColor={buttonTextColor}
            btnText={"Update"}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default DocumentationBtnSection;
