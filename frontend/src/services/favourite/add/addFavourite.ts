import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const addFavourite = async (data: {
  uid: string;
  productId: string;
}): Promise<Api.Response<null>> => {
  try {
    const response = await makeRequest({
      method: "post",
      data: { ...data },
      url: `favourites/add`,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { data, status } = error?.response;
      throw new ApiError(status, data.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};
