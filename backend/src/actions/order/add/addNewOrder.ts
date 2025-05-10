import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const addNewOrderToDatabase = async (order: Order.Order) => {
  const orderDocRef = db.collection("orders");
  if (!orderDocRef) throw new APIError("Couldn't find order collection.", 404);
  try {
    const { orderRequest, products, uid, status, note } = order;
    const orderData = await orderDocRef
      .add({
        orderId: "",
        orderRequest,
        products,
        status,
        uid,
        note,
      })
      .then((docRef) => {
        docRef.update({
          orderId: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        });
        return docRef.id;
      });
    return orderData;
  } catch (error) {
    logger.error("Error while adding order in firestore: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to add order in database. " + error, 500);
  }
};
