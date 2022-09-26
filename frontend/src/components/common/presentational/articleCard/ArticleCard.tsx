import { useState } from "react";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Box, Menu, MenuItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import EditFolderModal from "@src/components/shared/popUps/editFolderModal/editFolderModal";
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
  categoryName: string;
}

const ArticleCard = ({
  color,
  title,
  articleNo,
  id: folderId,
  categoryID,
  categoryName,
}: props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
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
  const handleEditModalOpen = () => {
    setOpenEditModal(true);
    handleClose();
  };
  const handleModalClose = () => {
    setOpenModal(false);
  };
  const handleEditClose = () => {
    setOpenEditModal(false);
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
              <FolderRoundedIcon style={{ color: color, fontSize: "2.2em" }} />
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
            <MenuItem onClick={handleEditModalOpen}>
              {articleCard.editCard}
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
      <EditFolderModal
        open={openEditModal}
        handleClose={handleEditClose}
        title={title}
        categoryName={categoryName}
        categoryID={categoryID}
        id={folderId}
      />
    </>
  );
};

export default ArticleCard;
