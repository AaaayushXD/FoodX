import * as argon from "argon2";
import logger from "../logger/logger.js";
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await argon.verify(hashedPassword, password);
  } catch (error) {
    logger.error("Error verifying password: ", error);
    throw new Error("Error verifying password. " + error);
  }
};
