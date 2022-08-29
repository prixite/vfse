import { useState, useEffect } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Box, Menu, MenuItem, Tooltip, IconButton } from "@mui/material";
import { Link, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import fileImage from "@src/assets/svgs/fileImage.svg";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { RouteParam } from "@src/helpers/interfaces/appInterfaces";
import { constants, timeOut } from "@src/helpers/utils/constants";
import constantsData from "@src/localization/en.json";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import { api, useOrganizationsMeReadQuery } from "@src/store/reducers/api";
import { Document } from "@src/store/reducers/generated";
import "@src/components/common/presentational/knowledgeTopCard/knowledgeTopCard.scss";
interface props {
  title: string;
  description: string;
  id: number;
  favourite?: boolean;
  path?: string;
  article?: Document;
}

const KnowledgeTopCard = ({
  title,
  description,
  id,
  favourite,
  path,
  article,
}: props) => {
  const param: RouteParam = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [cardText, setCardText] = useState("");
  const { organizationRoute } = constants;
  const location = useLocation();
  const { knowledgeBase, toastData } = constantsData;
  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const selectedOrganization = useSelectedOrganization();
  const { data: me } = useOrganizationsMeReadQuery(
    {
      id: selectedOrganization?.id.toString(),
    },
    {
      skip: !selectedOrganization,
    }
  );
  const [deleteArticle] = api.useDeleteArticleMutation();
  const [updateArticle] = api.useUpdateArticleMutation();
  const route = location?.pathname?.includes("folder")
    ? `/${organizationRoute}/${param?.id}/knowledge-base/folder/${param?.folderId}/documentation/${id}`
    : `/${organizationRoute}/${param?.id}/knowledge-base/documentation/${id}`;
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
        toast.success(toastData.knowledgeCardArticleDeleteSuccess, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        handleModalClose();
      })
      .catch(() => {
        toast.error(toastData.knowledgeCardArticleDeleteError, {
          autoClose: 1000,
          pauseOnHover: false,
        });
      });
  };
  const toggleFavourite = (favourite) => {
    updateArticle({
      id: id,
      document: { ...article, favorite: favourite },
    }).unwrap();
  };
  useEffect(() => {
    if (description) {
      //this is for extracting text containing p tags
      const stripedParagraphs = description.match(/<p>(.*?)<\/p>/g);
      if (stripedParagraphs && stripedParagraphs?.length) {
        //removing p tags from string
        const htmlToString = stripedParagraphs[0].replace(/<[^>]+>/g, "");
        //removing any html encoded entities
        const text = htmlToString.replace(/&#?[a-z0-9]{2,8};/g, "");
        setCardText(text);
      }
    }
  }, [description]);
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
            <h2 className="title" style={{ color: `${buttonBackground}` }}>
              {" "}
              {title}
            </h2>
            <div className="info">
              <p className="category">{cardText}</p>
            </div>
          </Box>
        </Link>
        {me?.is_superuser && path === "see-all" ? (
          <>
            {!favourite ? (
              <Tooltip title="Mark article as favourite" className="favIcon">
                <IconButton onClick={() => toggleFavourite(true)}>
                  <StarOutlineIcon style={{ color: "#6b7280" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip
                title="Unmark article from favourites"
                className="favIcon"
              >
                <IconButton onClick={() => toggleFavourite(false)}>
                  <StarIcon style={{ color: "#773CBD" }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        ) : (
          ""
        )}
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
              {knowledgeBase.delete}
            </MenuItem>
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
