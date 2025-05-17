import { signInUser } from "@/firebase/Authentication";
import { globalRequest } from "@/globalRequest";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { addLogs } from "@/services";
import dayjs from "dayjs";
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

    Cookies.set("accessToken", responseData.data.accessToken, {
      secure: true,
      sameSite: "strict",
    });
    Cookies.set("refreshToken", responseData.data.refreshToken, {
      secure: true,
      sameSite: "strict",
    });
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error?.response?.status || 500;
      const message = error?.response?.data?.message;
      const errorMessage = error?.response?.data?.error;
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
