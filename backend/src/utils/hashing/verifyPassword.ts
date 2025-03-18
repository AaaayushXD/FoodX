import * as argon from "argon2";
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    return await argon.verify(hashedPassword, password);
  } catch (error) {
    throw new Error("Error verifying password. " + error);
  }
};
