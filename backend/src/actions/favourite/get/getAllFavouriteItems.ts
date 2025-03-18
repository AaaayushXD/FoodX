import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const getFavouritesFromFirestore = async (uid: string) => {
  try {
    const docRef = db.collection("favourites").doc(uid);
    const doc = await docRef.get();
    if (doc.exists) {
      const docData = doc.data() as Favourite.FavouriteInfo;
      return docData;
    } else {
      const data: Favourite.FavouriteInfo = {
        uid,
        products: [],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: null,
      };

      await docRef.set(data);

      return data;
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while getting user's favourite. " + error,
      500
    );
  }
};
