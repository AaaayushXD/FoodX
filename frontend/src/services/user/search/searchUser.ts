import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const searchUser = async (
  uid: Auth.User["uid"]
): Promise<Api.Response<Auth.User[]>> => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `users/find?search=${uid}`,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errror;
      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  }
};
