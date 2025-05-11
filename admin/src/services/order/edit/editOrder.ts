import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const updateOrderStatus = async (data: {
  id: string;
  status: string;
  price: number;
  role: Auth.UserRole;
  uid: string;
}): Promise<Api.Response<Model.Revenue>> => {
  try {
    const response = await makeRequest({
      method: "put",
      data: {
        id: data.id,
        status: data.status,
        price: data.price,
        uid: data.uid,
        role: data.role,
      },
      url: "orders/update",
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
