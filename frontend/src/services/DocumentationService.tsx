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

export { addProductModelService };
