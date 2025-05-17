import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const bulkDeleteOfProduct = async (data: {
  ids: string[];
  category: "products" | "specials";
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "products/bulk-delete/products",
      data: { category: data.category, ids: [...data.ids] },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status as number;
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errors;

      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  }
};

export const deleteProduct = async (data: {
  id: string;
  type: "products" | "specials";
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: `products/delete/${data?.id}?collection=${data?.type}`,
      data: data.id
    });

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status as number;
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errors;

      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  }
};
