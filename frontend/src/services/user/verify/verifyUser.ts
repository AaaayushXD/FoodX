import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const verifyNewUser = async (
 data:{  code: string ,
  uid?: string,
  type: "reset" | "otp",
  accessToken?: string,}
): Promise<Api.Response<{userInfo: Auth.User}>> => {
  try {
    const response = (await makeRequest({
      method: "post",
      url: "/auth/verify",

      data: { ...data },
      headers: {
        "Authorization": `${data?.accessToken} Bearer`
      }
    }))
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { message, errors } = error?.response?.data;
      const status = error?.response?.status;
      throw new ApiError(status as number, message, errors, false);
    }
    throw new ApiError(500);
  }
};

export const resendOtp = async (data: {
  type: "reset",
  uid: string,
  email:string
}): Promise<Api.Response<null>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "/auth/resend",
      data:data
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { message, errors } = error?.response?.data;
      const status = error?.response?.status as number;
      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  }
};
