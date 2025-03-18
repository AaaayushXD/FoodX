import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const findUserInDatabase = async (id: string) => {
  const collections = ["customer", "admin", "chef"];
  let foundUser: User.UserInfo | undefined = undefined;
  try {
    for (const collection of collections) {
      const docRef = db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        foundUser = doc.data() as User.UserInfo;
        break;
      }
    }
    if (!foundUser) throw new APIError("User not found.", 404);
    return foundUser;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Error finding user in database.", 500);
  }
};
