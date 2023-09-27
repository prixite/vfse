import { toast } from "react-toastify";

import { timeOut } from "@src/helpers/utils/constants";

const addProductModelService = async (ProductModelCreate, addProductModel) => {
  await addProductModel({ productModelCreate: ProductModelCreate })
    .unwrap()
    .then(async () => {
      toast.success("Documentation Successfully Uploaded.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
    });
};

const deleteProductModelService = async (id, deleteProductModel) => {
  await deleteProductModel({
    id: id.toString(),
  }).unwrap();
};

const updateProductModelService = async (
  id,
  ProductModelCreate,
  updateProductModel
) => {
  await updateProductModel({
    id: id.toString(),
    productModelCreate: ProductModelCreate,
  })
    .unwrap()
    .then(async () => {
      toast.success("Documentation updated successfully.", {
        autoClose: timeOut,
        pauseOnHover: false,
      });
    });
};

export {
  addProductModelService,
  deleteProductModelService,
  updateProductModelService,
};
