import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const uploadImage = async (
  image: File,
  assetsType: Common.AssetsType,
  onProgress?: (progress: number) => void
): Promise<
  Api.Response<{ filename: string; folderName: Common.AssetsType }>
> => {
  const data = new FormData();
  data.append("image", image);
  data.append("folderName", assetsType);
  try {
    const response = await makeRequest({
      method: "post",
      url: `/images/upload`,
      
      data: data,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error?.response?.status as number;
      const message = error?.response?.data?.message;
      const errors = error?.response?.data?.errror;
      throw new ApiError(status, message, errors, false);
    }
    throw new ApiError(500);
  }
};
