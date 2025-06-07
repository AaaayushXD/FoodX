import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const addCategory = async (data: {
  image: Ui.Category["image"];
  name: Ui.Category["name"];
  bannerImage?: Ui.Category["bannerImage"];
  description: Ui.Category["description"];
}): Promise<Api.Response<Ui.Category[]>> => {
  try {
    const response = await makeRequest({
      method: "post",
      url: "categories/add",
      data: { name: data.name, image: data.image, bannerImage: data.bannerImage, description: data.description },
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
