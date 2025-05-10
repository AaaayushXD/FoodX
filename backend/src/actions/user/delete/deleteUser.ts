import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const deleteUserFromFireStore = async (
  uid: string,
  access: User.RoleType
) => {
  if (!uid) throw new APIError("UID is required to delete user.", 400);
  const customerDocRef = db.collection(access);

  try {
    const query = customerDocRef.doc(uid);
    const doc = await query.get();
    if (!doc.exists) throw new APIError("User not found.", 404);
    doc.ref.delete();
  } catch (error) {
    logger.error("Error while deleting user: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to delete user from database.", 500);
  }
};
