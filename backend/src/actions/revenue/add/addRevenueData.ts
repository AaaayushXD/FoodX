import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const addRevenueDataToFirestore = async (
  ordersArray: Revenue.RevenueData
) => {
  const revenueRef = db.collection("revenue");
  try {
    if (!revenueRef) throw new APIError("Revenue collection not found.", 404);

    const revenueDoc = await revenueRef.doc(ordersArray.id).get();

    if (revenueDoc.exists) {
      await revenueRef.doc(ordersArray.id).update({
        orders: FieldValue.arrayUnion(...ordersArray.orders),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } else {
      await revenueRef.doc(ordersArray.id).set({
        id: ordersArray.id,
        orders: ordersArray.orders,
        createdAt: FieldValue.serverTimestamp(),
      });
    }
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while adding revenue to database. " + error,
      500
    );
  }
};
