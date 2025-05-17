import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const bulkDeleteOfCategory = async (id: string[]) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "categories/bulk-delete",
      data: { ids: [...id] },
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
export const deleteCategory = async (id: string) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "categories/delete",
      data: { id },
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
