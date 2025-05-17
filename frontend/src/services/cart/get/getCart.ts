import { makeRequest } from "@/makeRequest";

export const getProductsOfCart = async (
 uid: string
): Promise<
 Api.Response<{
   createdAt: Common.TimeStamp;
   products: Ui.Product["id"][];
   uid: Auth.User["uid"];
 } | null>
> => {
 try {
   const response = await makeRequest({
     method: "get",
     url: `cart/${uid}`,
   });
   return response.data;
 } catch (error) {
   throw new Error("Failed to fetch cart products. Please try again." + error);
 }
};