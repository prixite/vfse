import { useState } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, Menu, MenuItem } from "@mui/material";
import { Link, useParams, useHistory } from "react-router-dom";
import { toast } from "react-toastify";

import fileImage from "@src/assets/svgs/fileImage.svg";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { RouteParam } from "@src/helpers/interfaces/appInterfaces";
import { constants } from "@src/helpers/utils/constants";
import { api } from "@src/store/reducers/api";
import "@src/components/common/presentational/knowledgeTopCard/knowledgeTopCard.scss";
interface props {
  title: string;
  description: string;
  id: number;
}

const KnowledgeTopCard = ({ title, description, id }: props) => {
  const param: RouteParam = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { organizationRoute } = constants;
  const history = useHistory();
  const [deleteArticle] = api.useDeleteArticleMutation();
  const route = history?.location?.pathname?.includes("folder")
    ? `/${organizationRoute}/${param?.id}/knowledge-base/folder/${param?.folderId}/documentation/3`
    : `/${organizationRoute}/${param?.id}/knowledge-base/documentation/3`;
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
  const handleDeleteArticle = () => {
    deleteArticle({ id: id })
      .unwrap()
      .then(() => {
        toast.success("Article successfully deleted", {
          autoClose: 1000,
          pauseOnHover: false,
        });
        handleModalClose();
      })
      .catch(() => {
        toast.error("Problem occured while deleting Article", {
          autoClose: 1000,
          pauseOnHover: false,
        });
      });
  };
  return (
    <>
      <div className="knowledge-top-card">
        <Link
          to={route}
          key={param?.id}
          className="knowledge-top-card"
          style={{ textDecoration: "none", height: "100%" }}
        >
          <Box component="div" className="card">
            <img src={fileImage} />
            <h2 className="title"> {title}</h2>
            <div className="info">
              <p className="category">{description}</p>
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
            <MenuItem onClick={handleModalOpen}>Delete</MenuItem>
          </Menu>
        </div>
      </div>
      <ConfirmationModal
        name={title}
        open={openModal}
        handleClose={handleModalClose}
        handleDeleteOrganization={handleDeleteArticle}
      />
    </>
  );
};

export default KnowledgeTopCard;
