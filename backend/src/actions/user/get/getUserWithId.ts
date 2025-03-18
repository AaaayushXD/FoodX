import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const getUserWithIdFromDatabase = async (
  path: User.RoleType,
  uid: string
): Promise<User.UserInfo> => {
  const userRef = db.collection(`${path}`).doc(uid);
  try {
    const userDoc = await userRef.get();
    if (!userDoc.exists)
      throw new APIError("No document found. Contact admin.", 404);
    const userData = userDoc.data() as User.UserInfo;
    if (!userData)
      throw new APIError("No user found. Please create your account.", 404);

    return userData;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Error getting user with their id. " + error, 500);
  }
};
