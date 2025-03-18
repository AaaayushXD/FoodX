import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const fetchNotifications = async ({
  currentFirstDoc,
  currentLastDoc,
  pageSize,
  sort,
  uid,
  direction,
}: Api.FetchNotification): Promise<
  Api.Response<{
    notifications: Model.Notification[];
    currentFirstDoc: string;
    currentLastDoc: string;
    length: number;
  }>
> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "notification/fetch",
      data: {
        currentFirstDoc,
        currentLastDoc,
        pageSize,
        sort,
        uid,
        direction,
      },
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
