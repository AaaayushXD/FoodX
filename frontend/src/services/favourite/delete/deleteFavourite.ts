import { makeRequest } from "@/makeRequest";

export const removeFavourites = async (data: {
 uid: string;
 productId: string;
}): Promise<
 Api.Response<{
   createdAt: Common.TimeStamp;
   updatedAt: Common.TimeStamp;
   products: Ui.Favourite[];
   uid: Auth.User["uid"];
 } | null>
> => {
 try {
   const response = await makeRequest({
     method: "delete",
     data: { ...data },
     url: `favourites/remove`,
   });
   return response.data;
 } catch (error) {
   throw new Error("Error while deleting favourites" + error);
 }
};