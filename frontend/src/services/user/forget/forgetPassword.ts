import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const forgetPassword = async ({
  email,
}: {
  email: string;
}): Promise<
  Api.Response<{
    accessToken: string;
    uid: string;
  }>
> => {
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

export const forgetPasswordWithAccessToken = async ({
  uid,
  accessToken,
  password,
}: {
  uid: string;
  accessToken: string;
  password: string;
  }): Promise<Api.Response<{}>> => {
  
  try {
    const response = await makeRequest({
      method: "post",
      url: "/auth/forgot-password",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: { uid, password, accessToken },
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
