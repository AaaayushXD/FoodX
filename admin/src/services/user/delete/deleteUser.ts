import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const bulkDeleteOfCustomer = async (data: {
  role: string;
  ids: string[];
}) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "users/bulk-delete",
      data: { role: data.role, ids: [...data.ids] },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Unable to bulk delete" + error);
  }
};

export const deleteAllUser = async (users: Auth.User[]) => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "users/bulk-delete",
      data: [...users],
    });
    return response.data;
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
export const deleteUser = async (data: { uid: string; role: string }) => {
  try {
    const response = await makeRequest({
      method: "delete",
      data: {
        uid: data.uid,
        role: data.role,
      },
      url: "users/delete-user",
    });
    return response.data;
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
