import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const updateCategory = async (
  data: Action.UpdateCategory
): Promise<Api.Response<Ui.Category[]>> => {
  try {
    const response = await makeRequest({
      method: "put",
      url: "categories/update",
      data: { id: data.id, field: data.field, newData: data.newData },
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
