import { makeRequest } from "@/makeRequest";

export const addLogs = async (data: Api.Logs) => {
 try {
   const response = await makeRequest({
     method: "post",
     url: "logs/add-logs",
     data: { ...data },
   });
   return response.data;
 } catch (error) {
   throw new Error("Unable to fetch action logs" + error);
 }
};