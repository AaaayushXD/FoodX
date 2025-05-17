import { makeRequest } from "@/makeRequest";

export const getNormalProducts = async () => {
  try {
    const response = await makeRequest({
      method: "get",
      url: "products/all",
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while adding banners : ${error}`);
  }
};
export const getSpecialProducts = async (url: "all" | "specials") => {
  try {
    const response = await makeRequest({
      method: "get",
      url: `products/${url}`,
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error while adding banners : ${error}`);
  }
};
