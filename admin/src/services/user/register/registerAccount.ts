import { globalRequest } from "@/globalRequest";
import { ApiError } from "@/helpers";
import axios from "axios";

export const signUp = async (data: Auth.Register) => {
  try {
    const response = await globalRequest({
      method: "post",
      url: "users/signIn",
      data: { ...data },
    });

    const ressponseData = response.data.data;
    localStorage.setItem("uid", ressponseData || ressponseData.uid);
    return;
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
