import { useState, useEffect } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Box, Menu, MenuItem, Tooltip, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import fileImage from "@src/assets/svgs/fileImage.svg";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { constants, timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";
import { useAppSelector, useSelectedOrganization } from "@src/store/hooks";
import { api, useOrganizationsMeReadQuery } from "@src/store/reducers/api";
import { Document } from "@src/store/reducers/generatedWrapper";
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
  const { t } = useTranslation();
  const param: RouteParam = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [cardText, setCardText] = useState(description);
  const { organizationRoute } = constants;
  const location = useLocation();
  const { buttonBackground } = useAppSelector((state) => state.myTheme);
  const selectedOrganization = useSelectedOrganization();
  const [isFavouriteDisabled, setFavouriteButtonDisabled] = useState(false);
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
        toast.success("Article successfully deleted.", {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        handleModalClose();
      })
      .catch((err) => {
        toastAPIError(
          "Problem occured while deleting Article",
          err.status,
          err.data
        );
      });
  };
  const toggleFavourite = (favourite) => {
    setFavouriteButtonDisabled(true);
    updateArticle({
      id: id,
      document: { ...article, favorite: favourite },
    })
      .unwrap()
      .then(() => {
        const message = favourite
          ? "added to your Favourite list."
          : "removed from Favourite list.";
        toast.success(`Article has been ${message}`, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        setFavouriteButtonDisabled(false);
      });
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
            <p className="description">{cardText}</p>
          </Box>
        </Link>
        {me?.is_superuser && path === "see-all" ? (
          <>
            {!favourite ? (
              <Tooltip title="Mark article as favourite" className="favIcon">
                <IconButton
                  disabled={isFavouriteDisabled}
                  onClick={() => toggleFavourite(true)}
                >
                  <StarOutlineIcon style={{ color: "#6b7280" }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip
                title="Unmark article from favourites"
                className="favIcon"
              >
                <IconButton
                  disabled={isFavouriteDisabled}
                  onClick={() => toggleFavourite(false)}
                >
                  <StarIcon style={{ color: "#773CBD" }} />
                </IconButton>
              </Tooltip>
            )}
          </>
        ) : (
          ""
        )}
        {!me?.view_only ? (
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
              <MenuItem onClick={handleModalOpen}>{t("Delete")}</MenuItem>
              <MenuItem>
                <Link
                  className="knowledge-top-card"
                  style={{
                    textDecoration: "none",
                    height: "100%",
                    color: "#111827",
                  }}
                  to={{
                    pathname: location.pathname.includes("folder")
                      ? `/${organizationRoute}/${param?.id}/knowledge-base/folder/${param?.folderId}/documentation/${id}/`
                      : `/${organizationRoute}/${param?.id}/knowledge-base/documentation/${id}/`,
                    state: { edit: true },
                  }}
                  state={{ edit: true }}
                >
                  Update
                </Link>
              </MenuItem>
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
        handleDeleteOrganization={handleDeleteArticle}
      />
    </>
  );
};

export default KnowledgeTopCard;
