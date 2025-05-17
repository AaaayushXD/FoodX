import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const getOrders = async (
  data: Api.FetchPaginate<keyof Ui.Order, Common.OrderStatus>
): Promise<
  Api.Response<{
    orders: Ui.Order[];
    currentFirstDoc: string;
    currentLastDoc: string;
    length: number;
  }>
> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "orders/get-orders",
      data: { ...data },
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

export const getOrderByUser = async (id: string) => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "orders/user-order",
      data: { id: id },
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
