import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const getUserBasedOnRoleFromDatabase = async (
  path: User.RoleType
): Promise<User.UserInfo[]> => {
  try {
    const userRef = db.collection(`${path}`);
    const userDoc = await userRef.get();
    if (userDoc.empty)
      throw new APIError("No document found. Contact admin.", 404);
    const userData = userDoc.docs.map((doc) => doc.data()) as User.UserInfo[];
    return userData;
  } catch (error) {
    logger.error(
      "Error while getting user based on role in database: " + error
    );
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while getting user based on role. " + error,
      500
    );
  }
};
