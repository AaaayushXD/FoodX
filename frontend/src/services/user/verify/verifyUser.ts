import { makeRequest } from "@/makeRequest";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { addLogs } from "@/services";

export const verifyNewUser = async (
 otp: number,
 uid: string
): Promise<
 Api.Response<{
   data: Auth.User;
 } | null>
> => {
 try {
   const response = await makeRequest({
     method: "post",
     url: "otp/verify",
     data: { code: otp, uid: uid },
   });
   toast.success("Congratulations! You logged in");
   const user = response.data.data;
   Cookies.set("accessToken", user.accessToken);
   Cookies.set("refreshToken", user.refreshToken);
   localStorage.removeItem("time");
   localStorage.removeItem("uid");
   await addLogs({
     action: "register",
     date: new Date().toISOString(),
     detail: `${
       user.userInfo.fullName
     } signed up at ${new Date().toLocaleString()}`,
     userId: user.userInfo.uid,
     userRole: user.userInfo.role,
   });

   return user.userInfo;
 } catch (error) {
   throw new Error("Error while verify user " + error);
 }
};