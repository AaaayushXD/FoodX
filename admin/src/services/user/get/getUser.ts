import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const getUsers = async (
  data: Api.FetchPaginate<keyof Auth.User, " ", Auth.UserRole>
): Promise<
  Api.Response<{
    users: Auth.User[];
    currentFirstDoc: string;
    currentLastDoc: string;
    length: number;
  }>
> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "users/get-users",
      data: { ...data },
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

// get user by role & uid
export const getUser = async (role: Auth.UserRole, userId: string) => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `users/${role}`,
      params: {
        userId: userId,
      },
    });
    return response;
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
