import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const get_productFeedback = async (
  data: Common.FetchPaginate<keyof Model.FeedbackDetail, ''> & {productId?:string}
): Promise<
  Api.Response<{
    feedbacks: Model.FeedbackDetail[];
    currentFirstDoc: string;
    currentLastDoc: string;
    length: number;
  }>
> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "feedback/get",
      data: { ...data },
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      throw new ApiError(status as number, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};
