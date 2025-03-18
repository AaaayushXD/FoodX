import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const bulkDeleteUserFromDatabase = async (
  path: "customer" | "admin" | "chef",
  id: string[]
) => {
  const userRef = db.collection(path);
  if (!userRef) throw new APIError("No collection available.", 404);
  try {
    const batch = db.batch();

    id.forEach((userId) => {
      const docRef = userRef.doc(userId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to bulk delete users data. " + error, 500);
  }
};
