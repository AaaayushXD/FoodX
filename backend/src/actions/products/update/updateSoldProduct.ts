import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const updateTotalSold = async (
  collection: string,
  id: string,
  incrementBy: number
) => {
  try {
    const productRef = db.collection(collection).doc(id);
    await productRef.update({
      totalSold: FieldValue.increment(incrementBy),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new APIError("Unable to update total orders. " + error, 500);
  }
};
