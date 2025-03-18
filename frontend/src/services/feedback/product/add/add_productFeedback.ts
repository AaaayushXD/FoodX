import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const add_productFeedback = async (
  data: Ui.FeedbackInfo
): Promise<Api.Response<[]>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "feedback/add",
      data: data,
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
