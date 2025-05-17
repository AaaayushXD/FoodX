import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const addNotification = async ({
  uid,
  message,
  title,
}: Actions.AddNotification): Promise<Api.Response<[]>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "notification/add",
      data: { uid, message, title },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error?.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500)
  }
};
