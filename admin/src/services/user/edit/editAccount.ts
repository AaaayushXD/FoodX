import { ApiError } from "@/helpers";
import { makeRequest } from "@/makeRequest";
import axios from "axios";

export const updateAccount = async (data: {
 avatar?: string;
 phoneNumber?: string;
 firstName?: string;
 lastName?: string;
 email?: string;
}): Promise<Api.Response<Auth.User>> => {
 try {
   const response = await makeRequest({
     method: "put",
     data: { ...data },
     url: "users/update-account",
   });
   return response.data;
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


export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
  uid: string;
  role: string;
 }): Promise<Api.Response<Auth.User>> => {
  try {
    const response = await makeRequest({
      method: "post",
      data: { ...data },
      url: "auth/change-password",
    });
    return response.data;
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