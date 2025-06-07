import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const deleteAccount = async (data: {
  id: string;
  role: Auth.UserRole;
}): Promise<Api.Response<Auth.User>> => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "users/delete-account",
      data: { id: data.id, role: data.role },
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
