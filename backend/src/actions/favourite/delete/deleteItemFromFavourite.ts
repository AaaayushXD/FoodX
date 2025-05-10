import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const removeItemFromFavourite = async (
  uid: string,
  productId: string
) => {
  try {
    const docRef = db.collection("favourites").doc(uid);
    const doc = await docRef.get();
    if (doc.exists) {
      const docData = doc.data() as Favourite.FavouriteInfo;
      if (docData.products.includes(productId)) {
        docData.products = docData.products.filter((pid) => pid !== productId);
        docData.updatedAt = FieldValue.serverTimestamp();

        await docRef.update({
          products: docData.products,
          updatedAt: docData.updatedAt,
        });
      }
    }
  } catch (error) {
    logger.error(`Error removing product from favourites for user: ${error}`);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while removing item from favourites. " + error,
      500
    );
  }
};
