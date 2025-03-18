import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const addProductInFavourite = async (uid: string, productId: string) => {
  try {
    const docRef = db.collection("favourites").doc(uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      await docRef.set({
        uid,
        products: [productId],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: null,
      });
    } else {
      const favouritesData = doc.data() as Favourite.FavouriteInfo;
      if (!favouritesData.products.includes(productId)) {
        favouritesData.products.push(productId);
        favouritesData.updatedAt = FieldValue.serverTimestamp();

        await docRef.update({
          products: favouritesData.products,
          updatedAt: favouritesData.updatedAt,
        });
      }
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while adding product in firestore. " + error,
      500
    );
  }
};
