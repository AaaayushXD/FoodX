import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const getCartsFromFirestore = async (uid: string) => {
  try {
    const docRef = db.collection("carts").doc(uid);
    const doc = await docRef.get();
    if (doc.exists) {
      const docData = doc.data() as Cart.CartInfo;
      return docData;
    } else {
      const data: Cart.CartInfo = {
        uid,
        products: [],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: null,
      };

      await docRef.set(data);

      return data;
    }
  } catch (error) {
    logger.error(`Error getting cart for user ${uid}: ${error}`);
    throw new APIError(
      "Something went wrong while getting user's carts. " + error,
      500
    );
  }
};
