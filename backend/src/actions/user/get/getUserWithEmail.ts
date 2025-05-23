import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const getUserWithEmailFromDatabase = async (
  path: User.RoleType,
  email: string
): Promise<User.UserInfo> => {
  const userRef = db.collection(`${path}`).where("email", "==", email);
  try {
    const userDoc = await userRef.get();
    if (userDoc.empty)
      throw new APIError("No document found. Contact admin.", 404);
    const userData = userDoc?.docs[0]?.data() as User.UserInfo;
    if (!userData)
      throw new APIError("No user found. Please create your account.", 404);

    return userData;
  } catch (error) {
    logger.error("Error while getting user with email in database: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while fetching user with email. " + error,
      500
    );
  }
};
