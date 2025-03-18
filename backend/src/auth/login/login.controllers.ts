import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { generateAccessAndRefreshToken } from "../../utils/token/tokenHandler.js";
import { login } from "./login.services.js";
import type { signInSchema } from "../../utils/validate/auth/signInSchema.js";

export const Login = asyncHandler(
  async (req: Request<{}, {}, signInSchema>, res: Response) => {
    const { email, password, role } = req.body;
    let response: API.ApiResponse;

    const user = await login({ email, password, role });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user.uid,
      role
    );

    res.setHeader("x-access-token", accessToken);
    res.setHeader("x-refresh-token", refreshToken);
    response = {
      data: {
        ...user,
        password: "",
        accessToken,
        refreshToken,
      },
      message: "Login Successful.",
      success: true,
      status: 200,
    };
    return res.status(200).json(response);
  }
);
