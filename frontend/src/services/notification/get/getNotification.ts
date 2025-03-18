import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const fetchNotifications = async ({
  currentFirstDoc,
  currentLastDoc,
  pageSize,
  sort,
  userId,
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
        userId,
        direction,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { errors, message } = error?.response?.data;
      const status = error?.response?.status;
      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  }
};
