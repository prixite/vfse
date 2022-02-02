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

const deleteProductModelService = async (id, deleteProductModel, refetch) => {
  await deleteProductModel({
    id: id.toString(),
  }).unwrap();
  refetch();
};

export { addProductModelService, deleteProductModelService };
