import { globalRequest } from "@/globalRequest";
import { ApiError } from "@/helpers";
import { addLogs } from "@/services/log";
import { toaster } from "@/utils";
import { getRoleFromAccessToken } from "@/utils/jwtUtils";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export const signIn = async (
  email: string,
  password?: string,
  userRole: string = "admin"
): Promise<
  Api.Response<Auth.User & { refreshToken: string; accessToken: string }>
> => {
  const toastLoader = toaster({
    icon: "loading",
    message: "Please wait...",
  });
  try {
    const response = (await globalRequest({
      method: "post",
      url: "auth/login",
      data: { email, role: userRole, password },
    })) as {
      data: Api.Response<
        Auth.User & {
          refreshToken: string;
          accessToken: string;
        }
      >;
    };
    console.log(response);
    Cookies.set("accessToken", response?.data?.data.accessToken);
    Cookies.set("refreshToken", response?.data.data?.refreshToken);
    // await addLogs({
    //   action: "login",
    //   date: new Date(),
    //   detail: `${response?.data?.data.fullName} was logged in ${new Date()} `,
    //   id: response?.data?.data.uid,
    //   role: response?.data?.data.role as Auth.UserRole,
    // });
    const role = await getRoleFromAccessToken();

    console.log(response);

    if (role !== response?.data?.data.role) {
      throw new ApiError(400, "You have not access to admin panel", "", false);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status as number;
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errors;

      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  } finally {
    toast.dismiss(toastLoader);
  }
};
