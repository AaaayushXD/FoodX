import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const getRevenue = async (
  data: Api.GetRevenue
): Promise<Api.Response<Model.Revenue[]>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "revenue/get",
      data: { ...data },
    });
    return response.data;
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
