import { makeRequest } from "@/makeRequest";
import { addLogs } from "@/services";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { authLogout } from "@/reducer";
import { Store } from "@/store";
import axios from "axios";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";

export const signOut = async () => {
  const toastLoader = toaster({
    icon: "loading",
    message: "Please wait...",
  });
  try {
    const response = await makeRequest({
      method: "post",
      url: "users/logout",
    });
    await addLogs({ action: "logout", date: new Date() });

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Store.dispatch(authLogout());
    toast.dismiss(toastLoader);
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
  }
};
