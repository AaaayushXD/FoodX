import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import { addLogs } from "@/services";
import axios from "axios";

export const updateAccount = async (data: {
 avatar?: string;
 phoneNumber?: number;
 fullName?: string;
 email?: string;
}) => {
 try {
   const response = await makeRequest({
     method: "post",
     data: { ...data },
     url: "users/update-account",
   });
   await addLogs({
     action: "update",
     date: new Date(),
     detail: `${
       response.data.data.updatedUser.fullName
     } updated  at ${new Date().toLocaleString()}`,
     userId: response.data.data.updatedUser.uid,
     userRole: response.data.data.updatedUser.role,
   });

   return response.data.data.updatedUser;
 } catch (error) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status as number;
    const message = error?.response?.data?.message;
    const errors = error?.response?.data?.errors;

    throw new ApiError(status, message, errors, false);
  }
  throw new ApiError(500);
 }
};