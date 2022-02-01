import { toast } from "react-toastify";

const addProductModelService = async (
  ProductModelCreate,
  addProductModel,
  refetch
) => {
  await addProductModel({ productModelCreate: ProductModelCreate })
    .unwrap()
    .then(async () => {
      toast.success("New User Added.", {
        autoClose: 1000,
        pauseOnHover: false,
        onClose: refetch,
      });
    });
};

const deleteProductModelService = async (
  id,
  prod_id,
  deleteProductModel,
  refetch
) => {
  await deleteProductModel({
    id: id.toString(),
    productPk: prod_id.toString(),
  }).unwrap();
  refetch();
};

export { addProductModelService, deleteProductModelService };
