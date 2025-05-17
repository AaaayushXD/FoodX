import { globalRequest } from "@/globalRequest";
import { ApiError } from "@/helpers";
import axios from "axios";

export const getBanners = async (
  path: "sponsors" | "banners"
): Promise<
  Api.Response<{
    banners: Ui.Banner[] | null;
    collection: Ui.BannerType; // TODO: rename to type
  }>
> => {
  try {
    const response = await globalRequest({
      method: "get",

      url: `banners/${path}`,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { data, status } = error?.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);  
  }
};
