import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useVfseCategoriesDeleteMutation } from "@src/store/reducers/generated";
import constantsData from "@src/localization/en.json";
import { constants, timeOut } from "@src/helpers/utils/constants";
import useStyles from "@src/components/common/smart/knowledgeSection/Styles";
import { Category } from "@src/store/reducers/api";
import CategoryEditModal from "@src/components/shared/popUps/categoryEditModal/categoryEditModal";
import ConfirmationModal from "@src/components/shared/popUps/confirmationModal/ConfirmationModal";

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
      .catch(() => {
        toast.error(toastData.categoryDeleteError, {
          autoClose: 2000,
          pauseOnHover: false,
        });
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
