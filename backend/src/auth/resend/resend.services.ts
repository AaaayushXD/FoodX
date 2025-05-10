import { APIError } from "../../helpers/error/ApiError.js";
import { OptGenerator } from "../../helpers/otp/otpGenerator.js";
import { redisClient } from "../../utils/cache/cache.js";
import logger from "../../utils/logger/logger.js";
import { sendOTPEmail } from "../../utils/messaging/email.js";

export const resendOtp = async (
  uid: string,
  email: string,
  type: string
): Promise<void> => {
  try {
    const otp = OptGenerator();
    const redisGetKey = type === "otp" ? `otp:${uid}` : `reset:${email}`;
    await redisClient.setEx(`${redisGetKey}`, 300, `${otp}`);
    await sendOTPEmail(email, `${otp}`);
  } catch (error) {
    logger.error(`Error sending OTP to user with email: ${error}`);
    throw new APIError("Error sending otp. " + error, 500);
  }
};
