import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const searchProduct = async (
  value: string
): Promise<Api.Response<Ui.Product[]>> => {
  try {
    const repsonse = await makeRequest({
      method: "get",
      url: "products/",
      params: { search: value },
    });
    return repsonse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error?.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};
