import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const getUserWithPhoneNumberFromDatabase = async (
  path: User.RoleType,
  phoneNumber: string
): Promise<User.UserInfo> => {
  const userRef = db
    .collection(`${path}`)
    .where("phoneNumber", "==", phoneNumber);
  try {
    const userDoc = await userRef.get();
    if (userDoc.empty)
      throw new APIError("No document found. Contact admin.", 404);
    const userData = userDoc?.docs[0]?.data() as User.UserInfo;
    if (!userData)
      throw new APIError("No user found. Please create your account.", 404);

    return userData;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while fetching user with phone Number. " + error,
      500
    );
  }
};
