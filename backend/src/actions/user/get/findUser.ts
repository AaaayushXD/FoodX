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

export const findUserByEmailInDatabase = async (email: string) => {
  try {
    const collections = ["admin", "chef", "customer"];

    for (const collection of collections) {
      const snapshot = await db
        .collection(collection)
        .where("email", "==", email)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0];
        return {
          role: collection,
          userData: userDoc.data() as User.UserInfo,
        };
      }
    }
    return null;
  } catch (error) {
    throw new APIError("Error finding user using email in database.", 500);
  }
};
