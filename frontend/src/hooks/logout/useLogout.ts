import React from "react";
import toast from "react-hot-toast";
import { makeRequest } from "@/makeRequest";
import { authLogout, resetOrder, resetFavourite, resetCart } from "@/reducer";
import Cookies from "js-cookie";
import { addLogs, logoutUser } from "@/services";
import dayjs from "dayjs";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { ApiError } from "@/helpers";
import { toaster } from "@/utils";

interface UseLogoutReturn {
  loading: boolean;
  logout: () => void;
}

export const useLogout = (): UseLogoutReturn => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { auth } = useAppSelector();

  const logout = async () => {
    const toastLoader = toaster({
      icon: "loading",
      message: "Please wait...",
    });
    const currentDate = dayjs().toISOString();

    setLoading(true);
    try {
      const response = await logoutUser({
        role: auth?.userInfo?.role,
        uid: auth?.userInfo?.uid,
      });
      if (response.status === 200) {
        toaster({
          title: response?.message,
          className: "bg-red-50",
          icon: "logout",
          message: "You are logged out successfully",
        });
      }
      await addLogs({
        action: "logout",
        date: currentDate,
        detail: ` ${auth.userInfo.fullName} was logged out at ${currentDate} `,
        userId: auth.userInfo.uid,
        userRole: auth.userInfo.role,
      });
      dispatch(resetOrder());
      dispatch(authLogout());
      dispatch(resetCart());
      dispatch(resetFavourite());
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    } catch (error) {
      if (error instanceof ApiError) {
        toaster({
          title: error?.message,
          className: " bg-red-50 ",
          icon: "error",
        });
      }
    } finally {
      toast.dismiss(toastLoader);
      setLoading(false);
    }
  };

  return { logout, loading };
};
