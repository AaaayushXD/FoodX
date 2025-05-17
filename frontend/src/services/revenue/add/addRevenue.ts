import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const addRevenue = async (
  data: Model.Revenue
): Promise<Api.Response<null>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "revenue/add",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};
