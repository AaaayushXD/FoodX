import { makeRequest } from "@/makeRequest";

import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { authLogout } from "@/reducer";
import { Store } from "@/store";
import axios from "axios";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";

export const signOut = async ({ uid, role }: { uid: string, role: Auth.UserRole }) => {
  const toastLoader = toaster({
    icon: "loading",
    message: "Please wait...",
  });
  try {
    const response = await makeRequest({
      method: "post",
      url: "auth/logout",
      data: {
        uid: uid,
        role: role,
      },
    });

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Store.dispatch(authLogout());

    toaster({
      icon: "success",
      title: "User logout",
      message: response?.data?.message,
      className: "bg-green-50 ",
    });
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
