import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const updateTotalSpent = async (
  collection: string,
  uid: string,
  price: number
) => {
  try {
    const userRef = db.collection(collection).doc(uid);
    await userRef.update({
      totalSpent: FieldValue.increment(price),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    logger.error("Error while updating total spent in database: " + error);
    throw new APIError("Unable to update total orders. " + error, 500);
  }
};
