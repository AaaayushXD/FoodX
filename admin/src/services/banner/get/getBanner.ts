import { makeRequest } from "@/makeRequest";

export const getBanners = async (data: { path: "sponsors" | "banners" }) => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `banners/${data.path}`,
    });

    return response.data.data;
  } catch (error) {
    return null;
  }
};