import { handleApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";

export const addProductToCart = async (
 uid: string,
 productId: string
): Promise<Api.Response<Ui.Product | Api.ApiError>> => {
 try {
   const response = await makeRequest({
     method: "post",
     data: { uid, productId },
     url: "cart/add",
   });
   return response.data;
 } catch (error: any) {
   return handleApiError(error.response.data) as any
 }
};