import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { signUp } from "./signup.services.js";
import { generateAccessAndRefreshToken } from "../../utils/token/tokenHandler.js";
import { sendOTPEmail } from "../../utils/messaging/email.js";
import { redisClient } from "../../utils/cache/cache.js";
import { OptGenerator } from "../../helpers/otp/otpGenerator.js";

export const SignUp = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body as unknown as Auth.Register;
  let response: API.ApiResponse;
  if (user.role === "admin") {
    return res.json({
      data: null,
      message: "Admin role cannot be registered through this endpoint.",
      success: false,
      status: 403,
    });
  }
  const userData = await signUp(user);

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userData.uid,
    userData.role
  );

  const otp = OptGenerator();
  await redisClient.setEx(`otp:${userData.uid}`, 300, `${otp}`);
  await sendOTPEmail(userData.email, `${otp}`);

  res.setHeader("x-access-token", accessToken);
  res.setHeader("x-refresh-token", refreshToken);
  response = {
    data: {
      ...userData,
      password: "",
      refreshToken,
      accessToken,
    },
    message: "Sign up successful.",
    success: true,
    status: 201,
  };
  return res.status(201).json(response);
});
