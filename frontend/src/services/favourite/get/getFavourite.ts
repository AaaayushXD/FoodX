import { makeRequest } from "@/makeRequest";

export const getFavourites = async (uid: string) => {
 try {
   const response = await makeRequest({
     method: "get",
     url: `favourites/${uid}`,
   });
   return response.data;
 } catch (error) {
   throw new Error("Error while fetching favourites" + error);
 }
};
