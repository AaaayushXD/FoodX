import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const forgetPassword = async ({
  email,
}: {
  email: string;
  }): Promise<Api.Response<{
    uid: string,
    accessToken: string,
}>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "/auth/reset",
      data: { email },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { message, errors } = error?.response?.data;
      const status = error?.response?.status;
      throw new ApiError(status as number, message, errors, false);
    }
    throw new ApiError(500);
  }
};
