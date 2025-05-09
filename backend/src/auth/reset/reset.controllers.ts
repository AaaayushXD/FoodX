import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { OptGenerator } from "../../helpers/otp/otpGenerator.js";
import { redisClient } from "../../utils/cache/cache.js";
import { sendOTPEmail } from "../../utils/messaging/email.js";
import { APIError } from "../../helpers/error/ApiError.js";
import { isEmailValid } from "../../helpers/validator/auth.validator.js";
import { findUserByEmailInDatabase } from "../../actions/user/get/findUser.js";

export const resetPasswordController = asyncHandler(
  async (req: Request<{}, {}, { email: string }>, res: Response) => {
    const { email } = req.body;

    if (!email) throw new APIError("Email is required.", 400);
    const validateEmail = isEmailValid(email);
    if (!validateEmail) throw new APIError("Invalid email.", 400);

    const user = await findUserByEmailInDatabase(email);
    if (!user) throw new APIError("User not found.", 404);

    const otp = OptGenerator();
    await redisClient.setEx(`reset:${email}`, 300, `${otp}`);
    await sendOTPEmail(email, `${otp}`);

    const response: API.ApiResponse = {
      status: 200,
      success: true,
      data: user.userData.uid || [],
      message: "Password reset email sent successfully.",
    };
    res.status(200).json(response);
  }
);
