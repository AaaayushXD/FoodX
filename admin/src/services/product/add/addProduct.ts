import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const addProducts = async (
  data: Action.UploadProduct
): Promise<Api.Response<Ui.Product[]>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: `products/add/${data?.collection}`,
      data: { ...data.product,price:parseInt(data.product.price as string),quantity:parseInt(data.product.quantity as string) },
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
