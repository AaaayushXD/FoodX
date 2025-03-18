import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { signUp } from "./signup.services.js";
import { generateAccessAndRefreshToken } from "../../utils/token/tokenHandler.js";

export const SignUp = asyncHandler(async (req: Request, res: Response) => {
  const user = req.body as unknown as Auth.Register;
  let response: API.ApiResponse;

  const userData = await signUp(user);
  
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userData.uid,
    userData.role
  );

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
