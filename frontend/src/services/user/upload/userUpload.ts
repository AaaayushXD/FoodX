import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const userUpload = async (
  image: File,
  assetsType: Common.AssetsType
): Promise<
  Api.Response<{ filename: string; folderName: Common.AssetsType }>
> => {
  const data = new FormData();
  data.append("image", image);
  data.append("folderName", assetsType);
  try {
    const response = await makeRequest({
      method: "post",
      url: "/images/upload",
      data: data,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errror;
      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  }
};
