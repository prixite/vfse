import React, { Dispatch, SetStateAction, useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Menu, MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "@src/components/common/presentational/clientCard/clientCard.scss";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { constants, timeOut } from "@src/helpers/utils/constants";
import { returnPayloadThemeObject } from "@src/helpers/utils/utils";
import { DeleteOrganizationService } from "@src/services/organizationService";
import { useAppDispatch, useAppSelector } from "@src/store/hooks";
import {
  Organization,
  useOrganizationsDeleteMutation,
  useOrganizationsListQuery,
} from "@src/store/reducers/api";
import { openAddModal } from "@src/store/reducers/appStore";
import { setSelectedOrganization } from "@src/store/reducers/organizationStore";
import { updateTheme } from "@src/store/reducers/themeStore";

interface ClientCardProps {
  setOrganization: Dispatch<SetStateAction<Organization>>;
  row: Organization;
  id: number;
  logo: string;
  name: string;
  setAction: Dispatch<SetStateAction<string>>;
  selected: boolean;
  superuser: boolean;
}
const ClientCard = ({
  id,
  logo,
  name,
  row,
  setOrganization,
  setAction,
  selected,
  superuser,
}: ClientCardProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [hoverBgColor, setHoverBgColor] = useState("transparent");
  const [hoverTextColor, setHoverTextColor] = useState("black");
  const open = Boolean(anchorEl);
  const [deleteOrganization] = useOrganizationsDeleteMutation();
  const { organizationRoute, networkRoute } = constants;

  const { buttonBackground, buttonTextColor } = useAppSelector(
    (state) => state.myTheme
  );

  const { data: organizationList, isLoading } = useOrganizationsListQuery({});

  const handleModalOpen = () => {
    setOpenModal(true);
    handleClose();
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const setColorOnHover = (bgColor: string, textColor: string) => {
    setHoverBgColor(bgColor);
    setHoverTextColor(textColor);
  };
  //const handleNetworkModalClose = () => setOpenNetworkModal(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleEditAppearance = () => {
    setAction("edit");
    dispatch(openAddModal());
    setOrganization(row);
    handleClose();
  };
  const handleNetworkModal = () => {
    setAction("new");
    dispatch(openAddModal());
    setOrganization(row);
    handleClose();
  };

  const handleDeleteOrganization = async () => {
    handleModalClose();
    await DeleteOrganizationService(id, deleteOrganization);
    toast.success("Organization successfully deleted.", {
      autoClose: timeOut,
      pauseOnHover: false,
    });

    if (selected && !isLoading && organizationList.length > 0) {
      switchOrganization(organizationList[0]);
    }
  };
  const handleUpdateSelectedOrganization = () => {
    if (superuser) {
      const themeObj = returnPayloadThemeObject(row);
      dispatch(setSelectedOrganization({ selectedOrganization: row }));
      dispatch(updateTheme(themeObj)),
        navigate(`/${organizationRoute}/${id}/${networkRoute}/`, {
          replace: true,
        });
    }
  };
  const switchOrganization = async (org) => {
    const themeObj = returnPayloadThemeObject(org);
    await Promise.all([
      dispatch(setSelectedOrganization({ selectedOrganization: org })),
      dispatch(updateTheme(themeObj)),
      navigate(`/${organizationRoute}/${org?.id}/`, { replace: true }),
    ]);
  };

  return (
    <div className="ClientCard">
      <Box
        style={{
          outline: `${selected ? `2px solid ${buttonBackground}` : ""}`,
          outlineOffset: `${selected ? "-2px" : ""}`,
        }}
        component="div"
        className="card"
        onClick={handleUpdateSelectedOrganization}
      >
        <div className="card__Header">
          <h3 className="ClientName">{name}</h3>
        </div>
        <div className="card__Logo">
          <img src={logo} />
        </div>
      </Box>
      <Button
        style={{
          borderColor: buttonBackground,
          color: hoverTextColor,
          backgroundColor: hoverBgColor,
        }}
        onClick={() => switchOrganization(row)}
        onMouseOver={() => setColorOnHover(buttonBackground, buttonTextColor)}
        onMouseLeave={() => setColorOnHover("transparent", "black")}
        className="add-btn"
        size="small"
        variant="outlined"
      >
        {t("Select")}
      </Button>
      <ConfirmationModal
        name={name}
        open={openModal}
        handleClose={handleModalClose}
        handleDeleteOrganization={handleDeleteOrganization}
      />
      {superuser ? (
        <div className="dropdownIcon">
          <MoreVertIcon
            id="client-options-button"
            className="dropdown"
            onClick={handleClick}
          />
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="client-options-button"
            anchorEl={anchorEl}
            open={open}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            className="dropdownMenu"
            onClose={handleClose}
          >
            <MenuItem onClick={handleEditAppearance}>
              {t("Edit appearance")}
            </MenuItem>
            <MenuItem onClick={handleNetworkModal}>
              {t("Add new health network")}
            </MenuItem>
            <MenuItem onClick={handleModalOpen} style={{ marginBottom: "0px" }}>
              {t("Delete")}
            </MenuItem>
          </Menu>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ClientCard;
