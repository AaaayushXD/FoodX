import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const update_productFeedback = async (
  id: string,
  field: keyof Model.FeedbackDetail,
  newData: Ui.FeedbackInfo[keyof Ui.FeedbackInfo],
  uid: Auth.User["uid"]
): Promise<Api.Response<Model.FeedbackDetail>> => {
  try {
    const response = await makeRequest({
      method: "patch",
      url: "feedback/update/",
      params: { id },
      data: { field, newData, uid },
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
