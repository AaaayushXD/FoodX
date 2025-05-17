import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { redisClient } from "../../utils/cache/cache.js";
import { APIError } from "../../helpers/error/ApiError.js";
import { updateUserDataInFirestore } from "../../actions/user/update/updateUser.js";
import { VerifyOtpSchemaType } from "../../utils/validate/auth/verifyOtpSchema.js";
import { findUserInDatabase } from "../../actions/user/get/findUser.js";
import { generateAccessAndRefreshToken } from "../../utils/token/tokenHandler.js";

export const verifyOtp = asyncHandler(
  async (req: Request<{}, {}, VerifyOtpSchemaType>, res: Response) => {
    const { code, uid, type } = req.body;
    let response: API.ApiResponse;

    const user = await findUserInDatabase(uid);
    if (!user) throw new APIError("User not found.", 404);
    const redisGetKey = type === "otp" ? `otp:${uid}` : `reset:${user?.email}`;

    const data = await redisClient.get(`${redisGetKey}`);
    if (!data) {
      throw new APIError("OTP not found.", 404);
    }

    if (!data || +data !== +code) throw new APIError("Invalid otp.", 500);

    if (type === "otp") {
      await updateUserDataInFirestore(user.uid, user.role, "isVerified", true);
      const userFromDatabase = await findUserInDatabase(user.uid);
      redisClient.del(`otp:${uid}`);

      response = {
        status: 200,
        data: { userInfo: { ...userFromDatabase, password: "" } },
        success: true,
        message: "User successfully verified.",
      };
      return res.status(200).json(response);
    } else if (type === "reset") {
      const { accessToken } = await generateAccessAndRefreshToken(
        user.uid,
        user.role
      );
      redisClient.setEx(`reset-accessToken:${user.uid}`, 300, accessToken);
      redisClient.del(`reset:${user.email}`);

      const userFromDatabase = await findUserInDatabase(user.uid);

      response = {
        status: 200,
        data: { userInfo: { ...userFromDatabase, password: "" }, accessToken },
        success: true,
        message: "OTP verified successfully.",
      };
      return res.status(200).json(response);
    } else {
      throw new APIError("Invalid type.", 400);
    }
  }
);
