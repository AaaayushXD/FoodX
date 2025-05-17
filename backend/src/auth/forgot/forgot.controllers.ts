import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { findUserInDatabase } from "../../actions/user/get/findUser.js";
import { generateAccessAndRefreshToken } from "../../utils/token/tokenHandler.js";
import { redisClient } from "../../utils/cache/cache.js";
import { updateUserDataInFirestore } from "../../actions/user/update/updateUser.js";
import { generateHashedPassword } from "../../utils/hashing/generateHashedPassword.js";
import { verifyPassword } from "../../utils/hashing/verifyPassword.js";

export const forgotPasswordController = asyncHandler(
  async (
    req: Request<{}, {}, { uid: string; password: string }>,
    res: Response
  ) => {
    const { uid, password } = req.body;
    let response: API.ApiResponse;

    const validAccessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const accessTokenFromRedis = await redisClient.get(
      `reset-accessToken:${uid}`
    );

    if (!accessTokenFromRedis || !validAccessToken) {
      response = {
        data: null,
        message: "Access token not found.",
        status: 401,
        success: false,
      };
      return res.status(401).json(response);
    }

    if (accessTokenFromRedis?.trim() !== validAccessToken?.trim()) {
      response = {
        data: null,
        message: "Invalid access token.",
        status: 401,
        success: false,
      };
      return res.status(401).json(response);
    }

    const user = await findUserInDatabase(uid);
    if (!user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    const isPasswordSame = await verifyPassword(password, user.password);
    if (isPasswordSame) {
      response = {
        status: 400,
        success: false,
        message: "New password cannot be same as old password.",
        data: null,
      };
      return res.status(400).json(response);
    }
    const hashedPassword = await generateHashedPassword(password);
    await updateUserDataInFirestore(uid, user.role, "password", hashedPassword);

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user.uid,
      user.role
    );

    await redisClient.del(`reset-accessToken:${uid}`);

    response = {
      status: 200,
      data: { user: { ...user, password: "" }, accessToken, refreshToken },
      success: true,
      message: "Password reset successfull.",
    };

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Password reset successfully.",
      data: {
        accessToken,
        refreshToken,
      },
    });
  }
);
