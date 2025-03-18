import { globalRequest } from "@/globalRequest";
import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const getNormalProducts = async (): Promise<
  Api.Response<Ui.Product[]>
> => {
  try {
    const response = await globalRequest({
      method: "get",
      url: "products/all",
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};

export const getSpecialProducts = async (): Promise<
  Api.Response<Ui.Product[]>
> => {
  try {
    const response = await globalRequest({
      method: "GET",
      url: "products/specials",
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};

export const getProductsByTag = async (
  data: string
): Promise<Api.Response<Ui.Product[]>> => {
  try {
    const response = await globalRequest({
      method: "get",
      url: `products/product-tag/${data}`,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};

export const getPopularProducts = async (): Promise<
  Api.Response<Ui.Product[]>
> => {
  try {
    const response = await globalRequest({
      method: "get",
      url: "products/popular",
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};

export const getProductById = async (
  productId: string,
  collection: Common.ProductCollection
): Promise<Api.Response<{ data: Ui.Product | Ui.SpecialProducts }>> => {
  try {
    const repsonse = await makeRequest({
      method: "get",
      url: `products/${productId}`,
      params: { id: productId, collection: collection },
    });
    return repsonse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};


export const recentProducts = async (
  productId: string,
  collection: Common.ProductCollection
): Promise<Api.Response<{ data:  Ui.SpecialProducts }>> => {
  try {
    const repsonse = await makeRequest({
      method: "get",
      url: `products/${productId}`,
      params: { id: productId, collection: collection },
    });
    return repsonse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const { status, data } = error.response;
      throw new ApiError(status, data?.message, data?.errors, false);
    }
    throw new ApiError(500);
  }
};