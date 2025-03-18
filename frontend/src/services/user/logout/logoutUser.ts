import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const logoutUser = async ({
  role,
  uid,
}: {
  uid: Auth.User["uid"];
  role: Auth.role;
}): Promise<Api.Response<[]>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "/auth/logout",
      data: { role, uid },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { message, errors } = error?.response?.data;
      const status = error?.response?.status;
      throw new ApiError(status, message, error, false);
    }
    throw new ApiError(500);
  }
};
