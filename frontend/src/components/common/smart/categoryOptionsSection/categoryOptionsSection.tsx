/* eslint react/prop-types: 0 */
import { useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import useStyles from "@src/components/common/smart/knowledgeSection/Styles";
import CategoryEditModal from "@src/components/shared/popUps/categoryEditModal/categoryEditModal";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";
import { constants, timeOut } from "@src/helpers/utils/constants";
import { toastAPIError } from "@src/helpers/utils/utils";
import constantsData from "@src/localization/en.json";
import { Category } from "@src/store/reducers/api";
import { useVfseCategoriesDeleteMutation } from "@src/store/reducers/generated";

const CategoryOptionsSection = ({ category, id }) => {
  const classes = useStyles();
  const { organizationRoute } = constants;
  const { toastData } = constantsData;

  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
  };

  const [openDeleteCategoryModal, setOpenDeleteCategoryModal] = useState(false);
  const handleCloseDeleteCategoryModal = () => {
    setOpenDeleteCategoryModal(false);
  };
  const { knowledgeBase } = constantsData;

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const [deleteCategory] = useVfseCategoriesDeleteMutation();

  const handleDeleteCategory = () => {
    deleteCategory({
      id: selectedCategory?.id?.toString(),
    })
      .unwrap()
      .then(() => {
        toast.success(toastData.categoryDeleteSuccess, {
          autoClose: timeOut,
          pauseOnHover: false,
        });
        handleCloseDeleteCategoryModal();
      })
      .catch((err) => {
        toastAPIError(toastData.categoryDeleteError, err.status, err.data);
        handleCloseDeleteCategoryModal();
      });
  };

  return (
    <>
      <div className={classes.optionsDiv}>
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
        <Link
          className={classes.seeAll}
          to={`/${organizationRoute}/${id}/knowledge-base/category/${category?.id}`}
        >
          {knowledgeBase.seeAllFolders}
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
