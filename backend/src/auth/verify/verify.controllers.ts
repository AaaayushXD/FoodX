import { Request, Response } from "express";
import { addUserToFirestore } from "../../actions/user/add/addUser.js";
import { getUserWithIdFromDatabase } from "../../actions/user/get/getUserWithId.js";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { redisClient } from "../../utils/cache/cache.js";
import { generateAccessAndRefreshToken } from "../../utils/token/tokenHandler.js";
import { options } from "../../config/cookieOption.js";

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { code, uid } = req.body;
  let response: API.ApiResponse;

  const data = await redisClient.get(`otp:${uid}`);
  const userInfo = await redisClient.get(`register_user:${uid}`);

  if (!data) {
    throw new Error("OTP not found.");
  }
  if (!userInfo) {
    throw new Error("User not registered. Please try again");
  }
  const user = await JSON.parse(userInfo);

  if (data && +data === +code) {
    await addUserToFirestore(user, user.role);
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user.uid,
      user.role
    );
    user.refreshToken = refreshToken;
    const userFromDatabase = await getUserWithIdFromDatabase(
      user.role,
      user.id
    );
    redisClient.del(`otp:${uid}`);
    redisClient.del(`register_user:${uid}`);

    response = {
      status: 201,
      data: { userInfo: userFromDatabase, accessToken, refreshToken },
      success: true,
      message: "User successfully verified and added",
    };
    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(response);
  } else {
    throw new Error("Invalid otp.");
  }
});
