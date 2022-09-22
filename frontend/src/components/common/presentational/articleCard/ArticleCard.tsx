import { useState } from "react";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Box, Grid, Menu, MenuItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FolderIconBlue from "@src/assets/svgs/folderIconBlue.svg";
import FolderIconGreen from "@src/assets/svgs/folderIconGreen.svg";
import FolderIconPink from "@src/assets/svgs/folderIconPink.svg";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { LocalizationInterface } from "@src/helpers/interfaces/localizationinterfaces";
import { constants, timeOut } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { toastAPIError } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import { api } from "@src/store/reducers/api";
import "@src/components/common/presentational/articleCard/articleCard.scss";

interface props {
  color: string;
  title: string;
  articleNo: string;
  id: number;
  categoryID: number;
}

const ArticleCard = ({
  color,
  title,
  articleNo,
  id: folderId,
  categoryID,
}: props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const constantData: LocalizationInterface = localizedData();
  const { explore, numberTitle } = constantData.articleCard;
  const { organizationRoute } = constants;
  const { toastData, articleCard } = constantsData;
  const { id } = useParams();
  const [deleteFolder] = api.useDeleteFolderMutation();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleModalOpen = () => {
    setOpenModal(true);
    handleClose();
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleDeleteFolder = () => {
    deleteFolder({ id: folderId })
      .unwrap()
      .then(() => {
        toast.success(toastData.articleCardFolderDeleteSuccess, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        handleModalClose();
      })
      .catch((error) => {
        toastAPIError(
          "Problem occured while deleting Folder",
          error.status,
          error?.data
        );
      });
  };
  return (
    <>
      <div className="Article-card">
        <Link
          to={`/${organizationRoute}/${id}/knowledge-base/category/${categoryID}/folder/${folderId}`}
          key={id}
          style={{ textDecoration: "none", height: "100%" }}
        >
          <Box component="div" className="card">
            <div className="general-info">
              <Grid className="folderIcon-Grid">
                <img
                  className="folderSvg"
                  style={{ color: `${color}` }}
                  src={
                    categoryID === 1
                      ? FolderIconBlue
                      : categoryID === 2
                      ? FolderIconGreen
                      : categoryID === 3
                      ? FolderIconPink
                      : FolderIconBlue
                  }
                  alt="FolderIcon"
                />
              </Grid>
              <div className="heading">
                <h2 className="title">{title}</h2>
              </div>
            </div>
            <div className="article-info">
              <div className="article-no">
                <TextsmsOutlinedIcon
                  style={{
                    color: "#696F77",
                    fontSize: "1em",
                    marginRight: "10px",
                  }}
                />
                <p>{`${articleNo} ${numberTitle}`}</p>
              </div>
              <div className="explore">
                <p className="text" style={{ color: "#696F77" }}>
                  {explore}
                </p>
                <ArrowRightAltIcon style={{ color: "#696F77" }} />
              </div>
            </div>
          </Box>
        </Link>
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
            <MenuItem onClick={handleModalOpen}>
              {articleCard.deleteCard}
            </MenuItem>
          </Menu>
        </div>
      </div>
      <ConfirmationModal
        name={title}
        open={openModal}
        handleClose={handleModalClose}
        handleDeleteOrganization={handleDeleteFolder}
      />
    </>
  );
};

export default ArticleCard;
