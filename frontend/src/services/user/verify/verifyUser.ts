import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const verifyNewUser = async (
  otp: string ,
  uid: string,
  type: "reset" | "otp"
): Promise<Api.Response<{ isVeried: boolean }>> => {
  try {
    const response = (await makeRequest({
      method: "post",
      url: "/auth/verify",

      data: { code: otp, uid: uid, type: type },
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

export const resendOtp = async (): Promise<Api.Response<null>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "/auth/resend",
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
