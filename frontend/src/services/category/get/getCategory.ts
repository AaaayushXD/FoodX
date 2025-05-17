import { globalRequest } from "@/globalRequest";
import { ApiError } from "@/helpers";
import axios from "axios";

export const getCategories = async (): Promise<
  Api.Response<Ui.Category[]>
> => {
  try {
    const response = await globalRequest({
      method: "GET",
      url: "categories/get",
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errror;
      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  }
};