import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const updateUser = async (data: {
  uid: string;
  role: "customer" | "admin" | "chef";
  field: string;
  newData: string;
}) => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "/users/update-user",
      data: { uid: data.uid, role: data.role, [data.field]: data.newData },
    });
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status as number;
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errors;

      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  }
};

export const updateRole = async (data: {
  uid: string;
  role: string;
  newRole: string;
}): Promise<
  Api.Response<
    Auth.User & {
      accessToken: string;
      refreshToken: string;
    }
  >
> => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "users/update-role",
      data: {
        uid: data.uid,
        role: data.role,
        newRole: data.newRole,
      },
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
