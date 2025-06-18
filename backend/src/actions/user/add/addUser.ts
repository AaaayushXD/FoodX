import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { generateHashedPassword } from "../../../utils/hashing/generateHashedPassword.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import { generateRandomId } from "../../../utils/random/randomId.js";
import logger from "../../../utils/logger/logger.js";

export const addUserToFirestore = async (
  user: Auth.Register,
  access: User.RoleType,
  uid?: string,
  isUpdatingRole: boolean = false
) => {
  const customerDocRef = db.collection(access);
  if (!customerDocRef) throw new APIError("No document found.", 404);
  try {
    const userId = uid ? uid : generateRandomId();
    const oldUser = await customerDocRef.where("email", "==", user.email).get();
    if (oldUser.size !== 0)
      throw new APIError("User already exist with this email.", 409);
    let hashedPassword = user.password;
    if (!isUpdatingRole) {
      hashedPassword = await generateHashedPassword(user.password);
    }
    await customerDocRef.doc(userId).set({
      fullName: `${user.firstName?.trim()} ${user.lastName?.trim()}`,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: access,
      avatar: user.avatar,
      uid: userId,
      password: hashedPassword,
      isVerified: false,
      totalOrder: 0,
      totalSpent: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: null,
    });

    const newUser = await customerDocRef.doc(userId).get();
    return newUser.data() as User.UserInfo;
  } catch (error) {
    logger.error("Error while adding user : " + error);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while adding user to the database. " + error,
      500
    );
  }
};
