import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { OptGenerator } from "../../helpers/otp/otpGenerator.js";
import { redisClient } from "../../utils/cache/cache.js";
import { sendOTPEmail } from "../../utils/messaging/email.js";
import { APIError } from "../../helpers/error/ApiError.js";
import { getUserWithEmailFromDatabase } from "../../actions/user/get/getUserWithEmail.js";
import { isEmailValid } from "../../helpers/validator/auth.validator.js";

export const resetPasswordController = asyncHandler(
  async (
    req: Request<{}, {}, { role: User.RoleType; email: string }>,
    res: Response
  ) => {
    const { role, email } = req.body;

    if (!role || !email) throw new APIError("Role and email is required.", 400);
    const validateEmail = isEmailValid(email);
    if (!validateEmail) throw new APIError("Invalid email.", 400);

    await getUserWithEmailFromDatabase(role, email);
    const otp = OptGenerator();
    await redisClient.setEx(`reset:${email}`, 300, `${otp}`);
    await sendOTPEmail(email, `${otp}`);

    const response: API.ApiResponse = {
      status: 200,
      success: true,
      data: [],
      message: "Password reset email sent successfully.",
    };
    res.status(200).json(response);
  }
);
