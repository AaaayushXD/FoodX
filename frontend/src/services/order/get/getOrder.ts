import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const getOrderByUser = async (
  data: Actions.GetOrderModal<keyof Model.Order>
): Promise<Api.Response<Api.FetchOrder>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "orders/user-order",
      data: { ...data },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { errors, message } = error?.response?.data;
      const status = error?.response?.status;
      throw new ApiError(status as number, message, errors, false);
    }
    throw new ApiError(500);
  }
};

export const getOrder = async (
  orderId: string
): Promise<Api.Response<Model.Order>> => {
  try {
    const response = await makeRequest({
      method: "get",
      params: { id: orderId },
      url: "/orders/" + orderId,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status;
      const { errors, message } = error?.response?.data;
      throw new ApiError(status as number, message, errors, false);
    }
    throw new ApiError(500);
  }
};
