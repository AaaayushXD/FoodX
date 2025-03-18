import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const getTickets = async (
  data: Api.FetchPaginate<keyof Ui.TicketType, Common.TicketStatus,"">
) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "tickets/get-all",
      data: { ...data },
    });
    return response.data.data;
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
