import { makeRequest } from "@/makeRequest";
import { addLogs } from "@/services";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";
import { ApiError } from "@/helpers";
export const verifyNewUser = async (otp: number, uid: string) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "otp/verify",
      data: { code: otp, uid: uid },
    });
    toast.success("Congratulations! You logged in");
    const user = response.data.data;
    Cookies.set("accessToken", user.accessToken);
    Cookies.set("refreshToken", user.refreshToken);
    localStorage.removeItem("time");
    localStorage.removeItem("uid");
    await addLogs({
      action: "register",
      date: new Date(),
      detail: `${
        user.userInfo.fullName
      } signed up at ${new Date().toLocaleString()}`,
      userId: user.userInfo.uid,
      userRole: user.userInfo.role,
    });

    return user.userInfo;
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
