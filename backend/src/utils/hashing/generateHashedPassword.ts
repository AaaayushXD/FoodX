import * as argon from "argon2";
import { APIError } from "../../helpers/error/ApiError.js";
export const generateHashedPassword = async (password: string) => {
  try {
    return await argon.hash(password, {
      hashLength: 32,
      type: argon.argon2id,
      raw: false,
    });
  } catch (error) {
    throw new APIError("Error hashing password. " + error, 500);
  }
};
