import { makeRequest } from "@/makeRequest";

export const deleteNotification = async ({ id }: Actions.DeleteNotification) => {
 try {
   const response = await makeRequest({
     method: "delete",
     url: "notification/delete",
     data: { id },
   });
   return response.data.data;
 } catch (error) {
   throw new Error("Error while deleting notification " + error);
 }
};
