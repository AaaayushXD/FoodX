import { Notification } from "@onesignal/node-onesignal";
import { APIError } from "../../helpers/error/ApiError.js";
import { oneSignalClient } from "./index.js";
import { ORDERSTATUS } from "../../helpers/messages/email/orderStatus.message.js";
import { OTPEMAIL } from "../../helpers/messages/email/otp.messages.js";
import logger from "../logger/logger.js";

export const sendOTPEmail = async (email: string, otp: string) => {
  try {
    const notification: Notification = {
      app_id: process.env.ONESIGNAL_APP_ID as string,
      include_email_tokens: [email],
      email_subject: "Your OTP Code",
      email_body: OTPEMAIL(otp),
    };

    await oneSignalClient.createNotification(notification);
  } catch (error) {
    logger.error("Error sending OTP email: ", error);
    throw new APIError("Failed to send OTP email" + error, 500);
  }
};

export const sendOrderStatusEmail = async (
  email: string,
  orderId: string,
  userName: string,
  status: string
) => {
  try {
    const notification: Notification = {
      app_id: process.env.ONESIGNAL_APP_ID as string,
      include_email_tokens: [email],
      email_subject: "Your Order Status",
      email_body: ORDERSTATUS(status, orderId, userName),
    };

    await oneSignalClient.createNotification(notification);
  } catch (error) {
    logger.error("Error sending Order Status email: ", error);
    throw new APIError("Failed to send Order Status email" + error, 500);
  }
};
