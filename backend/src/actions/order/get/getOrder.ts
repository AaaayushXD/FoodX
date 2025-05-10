import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const getOrder = async (id: string) => {
  try {
    const orderRef = db.collection("orders");
    const doc = await orderRef.doc(id).get();
    if (!doc.exists) throw new APIError("Couldn't find your order", 404);
    const docData = doc.data() as Order.OrderInfo;
    return docData;
  } catch (error) {
    logger.error("Error while getting order in firestore: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError("Error searching order. " + error, 500);
  }
};
