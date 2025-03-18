import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import { addLogs } from "@/services";
import axios from "axios";

export const updateAccount = async (
  user: Actions.UpdateProfile
): Promise<
  Api.Response<
    Auth.User & {
      refreshToken: string;
      createdAt: Common.TimeStamp;
      updatedAt: Common.TimeStamp;
    }
  >
> => {
  try {
    const response = await makeRequest({
      method: "put",
      data: user,
      url: "users/update-account",
    });
    await addLogs({
      action: "update",
      date: new Date().toISOString(),
      detail: `${
        response.data?.data?.firstName + " " + response?.data?.data?.lastName
      } updated  at ${new Date().toLocaleString()}`,
      userId: response.data?.data?.uid,
      userRole: response.data?.data?.role,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { data, status } = error?.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};
