import { globalRequest } from "@/globalRequest";
import toast from "react-hot-toast";
import axios from "axios";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";

export const signIn = async (
  email: string,
  password?: string,
  userRole = "customer"
): Promise<
  Api.Response<
    Auth.User & {
      createdAt: Common.TimeStamp;
      updatedAt: Common.TimeStamp;
      refreshToken: string;
      accessToken: string;
    }
  >
> => {
  const toastLoader = toaster({
    title: "Loading...",
    icon: "loading",
  });
  try {
    const response = await globalRequest({
      method: "post",
      url: "/auth/login",
      data: { email, role: userRole, password },
    });

    const responseData = <
      Api.Response<
        Auth.User & {
          createdAt: Common.TimeStamp;
          updatedAt: Common.TimeStamp;
          refreshToken: string;
          accessToken: string;
        }
      >
    >response.data;

    localStorage.setItem("accessToken", responseData.data.accessToken);
    localStorage.setItem("refreshToken", responseData.data.refreshToken);
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error?.response?.status || 500;
      const message = error?.response?.data?.message;
      const errorMessage = error?.response?.data?.error;
      if(message === "Validation Error") {
        throw new ApiError(statusCode, error?.response?.data?.errors?.[0]?.message, errorMessage, false);
      }
      throw new ApiError<{ field: string; message: string }[]>(
        statusCode,
        message,
        errorMessage,
        false
      );
    }
    throw new ApiError(500);
  } finally {
    toast.dismiss(toastLoader);
  }
};
