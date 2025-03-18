import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const addCartInFirestore = async (uid: string, productId: string) => {
  try {
    const docRef = db.collection("carts").doc(uid);
    const doc = await docRef.get();
    if (!doc.exists) {
      await docRef.set({
        uid,
        products: [productId],
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: null,
      });
    } else {
      const cartData = doc.data() as Cart.CartInfo;
      if (!cartData.products.includes(productId)) {
        cartData.products.push(productId);
        cartData.updatedAt = FieldValue.serverTimestamp();

        await docRef.update({
          products: cartData.products,
          updatedAt: cartData.updatedAt,
        });
      }
    }
  } catch (error) {
    throw new APIError(
      "Something went wrong while adding products in cart. " + error,
      500
    );
  }
};
