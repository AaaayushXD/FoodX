import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const addOrder = async (
  data: Model.Order
): Promise<Api.Response<string>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "/orders/add",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status as number  ;
      const data = error?.response?.data;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};
