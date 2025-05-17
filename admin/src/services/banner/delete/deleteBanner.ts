import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const deleteBanner = async (data: {
  id: string;
  path: "banners" | "sponsors";
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      data: { id: data.id, path: data.path },
      url: "banners/delete-banner",
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

export const bulkDeleteBanner = async (data: {
  id: string[];
  path: "sponsors" | "banners";
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      data: { ids: [...data.id], path: data.path },
      url: "banners/bulk-delete",
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
