import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const delete_productFeedback = async (
  id: string
): Promise<Api.Response<[]>> => {
  try {
    const response = await makeRequest({
      method: "delete",
      url: "feedback/delete/",
      params: { id },
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error?.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};
