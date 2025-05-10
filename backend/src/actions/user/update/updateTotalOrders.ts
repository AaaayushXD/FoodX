import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const updateTotalOrder = async (collection: string, uid: string) => {
  try {
    const userRef = db.collection(collection).doc(uid);
    await userRef.update({
      totalOrder: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    logger.error("Error while updating total orders in database: " + error);
    throw new APIError("Unable to update total orders. " + error, 500);
  }
};
