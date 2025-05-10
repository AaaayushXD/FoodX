import { getUserWithIdFromDatabase } from "../../actions/user/get/getUserWithId.js";
import { updateUserDataInFirestore } from "../../actions/user/update/updateUser.js";
import { APIError } from "../../helpers/error/ApiError.js";
import { generateHashedPassword } from "../../utils/hashing/generateHashedPassword.js";
import { verifyPassword } from "../../utils/hashing/verifyPassword.js";
import logger from "../../utils/logger/logger.js";

export const ChangePasswordService = async ({
  newPassword,
  oldPassword,
  uid,
  role,
}: Auth.ChangePassword) => {
  try {
    const user = await getUserWithIdFromDatabase(role, uid);
    if (!user || !user.uid)
      throw new APIError(
        "User not found with provided id. Contact admin for further information.",
        404
      );

    // Verify old password
    const isValidPassword = await verifyPassword(oldPassword, user.password);

    if (!isValidPassword)
      throw new APIError("Old password is incorrect. Please try again.", 401);

    // Update password
    const hashedPassword = await generateHashedPassword(newPassword);

    await updateUserDataInFirestore(uid, role, "password", hashedPassword);
  } catch (error) {
    logger.error(`Error changing password for user: ${error}`);
    if (error instanceof APIError) throw error;
    throw new APIError("Error while changing password. Please try again.", 500);
  }
};
