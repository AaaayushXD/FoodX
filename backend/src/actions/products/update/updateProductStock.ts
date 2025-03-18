import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const updateProductStockInFirestore = async (
  collection: Product.Collection["name"],
  id: string,
  decreaseBy: number
) => {
  try {
    const productRef = db.collection(collection).doc(id);
    await productRef.update({
      quantity: FieldValue.increment(-decreaseBy),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw new APIError(
      "Error updating product stock in database. " + error,
      500
    );
  }
};
