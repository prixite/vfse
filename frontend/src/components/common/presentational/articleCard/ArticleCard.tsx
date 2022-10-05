import { useState } from "react";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Box, Grid, Menu, MenuItem } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import FolderSVG from "@src/components/common/presentational/articleCard/FolderSVG";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import {
  LocalizationInterface,
  selectedArticleCard,
} from "@src/helpers/interfaces/localizationinterfaces";
import { constants, timeOut } from "@src/helpers/utils/constants";
import { localizedData } from "@src/helpers/utils/language";
import { toastAPIError } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import { useSelectedOrganization } from "@src/store/hooks";
import { api, useOrganizationsMeReadQuery } from "@src/store/reducers/api";

import "@src/components/common/presentational/articleCard/articleCard.scss";

interface props {
  color: string;
  title: string;
  articleNo: string;
  id: number;
  categoryID?: number;
  categories?: number[];
  categoryName?: string;
  handleEdit?: (selectedCardTypes: selectedArticleCard) => void;
}

const ArticleCard = ({
  color,
  title,
  articleNo,
  id: folderId,
  categoryID,
  categories,
  categoryName,
  handleEdit,
}: props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const constantData: LocalizationInterface = localizedData();
  const { data: currentUser } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });
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
  const onEdit = () => {
    handleEdit({
      text: "edit",
      title: title,
      folderId: folderId,
      categories: categories,
      categoryName: categoryName,
    });
    handleClose();
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
                <FolderSVG color={color} />
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
        {!currentUser?.view_only ? (
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
              <MenuItem onClick={onEdit}>{articleCard.editCard}</MenuItem>
            </Menu>
          </div>
        ) : (
          ""
        )}
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
