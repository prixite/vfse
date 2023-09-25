/* eslint react/prop-types: 0 */
import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import useStyles from "@src/components/common/smart/knowledgeSection/Styles";
import CategoryEditModal from "@src/components/shared/popUps/categoryEditModal/categoryEditModal";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { constants, timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";
import { useSelectedOrganization } from "@src/store/hooks";
import { Category, useOrganizationsMeReadQuery } from "@src/store/reducers/api";

const CategoryOptionsSection = ({ category, id }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { organizationRoute } = constants;
  const { data: currentUser } = useOrganizationsMeReadQuery({
    id: useSelectedOrganization().id.toString(),
  });
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
  };

  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
  const handleCloseDeleteCategoryModal = () => {
    setOpenDeleteCategoryModal(false);
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const [deleteCategory] = useVfseCategoriesDeleteMutation();

  const handleDeleteCategory = () => {
    deleteCategory({
      id: selectedCategory?.id?.toString(),
    })
      .unwrap()
      .then(() => {
        toast.success("Category deleted successfully.", {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        handleCloseDeleteCategoryModal();
      })
      .catch((err) => {
        toastAPIError(
          "Error occured while deleting Category",
          err.status,
          err.data
        );
        handleCloseDeleteCategoryModal();
      });
  };

  return (
    <>
      <div className={classes.optionsDiv}>
        {!currentUser?.view_only ? (
          <>
            <DeleteIcon
              className={classes.optionsIcon}
              onClick={() => {
                setSelectedCategory(category);
                setOpenDeleteCategoryModal(true);
              }}
            />
            <EditIcon
              className={classes.optionsIcon}
              onClick={() => {
                setSelectedCategory(category);
                setOpenCategoryModal(true);
              }}
            />
          </>
        ) : (
          ""
        )}
        <Link
          className={classes.seeAll}
          to={`/${organizationRoute}/${id}/knowledge-base/category/${category?.id}`}
        >
          {t("See All Folders")}
        </Link>
      </div>
      {selectedCategory && (
        <CategoryEditModal
          open={openCategoryModal}
          handleClose={handleCloseCategoryModal}
          id={selectedCategory?.id}
        />
      )}
      {selectedCategory && (
        <ConfirmationModal
          name={selectedCategory?.name}
          open={openDeleteCategoryModal}
          handleClose={handleCloseDeleteCategoryModal}
          handleDeleteOrganization={handleDeleteCategory}
        />
      )}
    </>
  );
};

export default CategoryOptionsSection;
