import { globalRequest } from "@/globalRequest";
import { ApiError } from "@/helpers";
import axios from "axios";

export const signUp = async (
  data: Auth.ValidationType
):  Promise<
Api.Response<
  Auth.User & {
    createdAt: Common.TimeStamp;
    updatedAt: Common.TimeStamp;
    refreshToken: string;
    accessToken: string;
  }
>
> => {
  try {
    const response = await globalRequest({
      method: "post",
      url: "/auth/sign-up",
      data: { ...data },
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
     
      const statusCode = error?.response?.status || 500;
      const message = error?.response?.data?.message;
      const errorMessage = error?.response?.data?.error;
      if(message === "Validation Error") {
        throw new ApiError(statusCode, error?.response?.data?.errors?.[0]?.message, errorMessage, false);
      }
      throw new ApiError(statusCode, message, errorMessage, false);
    }
    throw new ApiError(500);
  }
};
