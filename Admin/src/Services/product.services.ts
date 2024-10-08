import { authLogout } from "../Reducer/user.reducer";
import { Store } from "../Store";
import { makeRequest } from "../makeRequest";
import { UpdateCategory } from "../models/category.model";
import {  UploadProduct } from "../models/product.model";



export const getNormalProducts = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "products/all",
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while adding banners : ${error}`);
  }
};
export const getSpecialProducts = async (url: "all" | "specials" = "specials") => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `products/${url}`,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while adding banners : ${error}`);
  }
};

export const addProducts = async (data: UploadProduct) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "products/add-product",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    if (error === "You have not access, please login again...")
      Store.dispatch(authLogout());
    throw new Error(`Error while adding banners : ${error}`);
  }
};
export const updateProduct = async (data: UpdateCategory) => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "products/update-product",
      data: {
        category: data.category,
        id: data.id,
        field: data.field,
        newData: data.newData,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while updating food : ${error}`);
  }
};
// product
export const bulkDeleteOfProduct = async (data: {
  ids: string[];
  category: "products" | "specials";
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "products/bulk-delete",
      data: { category: data.category, ids: [...data.ids] },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete categories");
  }
};

export const deleteProduct = async (data: {
  id: string;
  type: "products" | "specials";
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "products/delete-product",
      data: { id: data.id, type: data.type },
    });

    return response.data.data;
  } catch (error) {
    throw new Error("Unable to delete product" + error);
  }
};
