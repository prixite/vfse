import { toast } from "react-toastify";

const addProductModelService = async (ProductModelCreate, addProductModel) => {
  await addProductModel({ productModelCreate: ProductModelCreate })
    .unwrap()
    .then(async () => {
      toast.success("New User Added.", {
        autoClose: 1000,
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
        autoClose: 1000,
        pauseOnHover: false,
      });
    });
};

export {
  addProductModelService,
  deleteProductModelService,
  updateProductModelService,
};
