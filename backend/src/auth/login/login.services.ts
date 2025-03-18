import { getUserWithEmailFromDatabase } from "../../actions/user/get/getUserWithEmail.js";
import { APIError } from "../../helpers/error/ApiError.js";
import { verifyPassword } from "../../utils/hashing/verifyPassword.js";

export const login = async ({ email, password, role }: Auth.Login) => {
  try {
    console.log(email, password, role);
    const user = await getUserWithEmailFromDatabase(role, email);
    if (!user || !user.uid)
      throw new APIError(
        "User not found with provided email. Contact admin for further information.",
        404
      );

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword)
      throw new APIError("Password is incorrect. Please try again.", 401);

    return user;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Error logging in user. " + error, 500);
  }
};
