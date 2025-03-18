import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const addBanner = async (data: {
  name: string;
  img: string;
  path: "sponsors" | "banners";
  link: string;
}): Promise<Api.Response<null>> => {
  try {
    const response = await makeRequest({
      method: "post",
      data: {
        title: data.name,
        image: data.img,
        path: data.path,
        link: data.link,
      },
      url: "banners/add-banner",
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
