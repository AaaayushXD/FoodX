import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const createTicket = async (
  data: Ui.TicketType
): Promise<Api.Response<[]>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "tickets/add-ticket",
      data: data,
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
