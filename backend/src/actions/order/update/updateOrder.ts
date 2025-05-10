import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";
import { findProductInDatabase } from "../../products/get/findProduct.js";
import { updateProductStockInFirestore } from "../../products/update/updateProductStock.js";
import { updateTotalSold } from "../../products/update/updateSoldProduct.js";
import { findUserInDatabase } from "../../user/get/findUser.js";
import { updateTotalOrder } from "../../user/update/updateTotalOrders.js";
import { updateTotalSpent } from "../../user/update/updateUserTotalSpent.js";
import { getOrder } from "../get/getOrder.js";

export const updateOrderStatusInDatabase = async (
  id: string,
  status: Order.OrderStatus,
  price: number
) => {
  const orderRef = db.collection("orders").doc(id);
  if (!orderRef) throw new APIError("No document found.", 404);
  try {
    const batch = db.batch();
    let doc;
    if (status !== "completed") {
      doc = await orderRef.update({
        status,
      });
      const getDocData = (await orderRef.get()).data();
      return getDocData;
    }
    doc = await orderRef.update({
      status,
      orderFullfilled: new Date().getTime(),
    });
    const orderData = await getOrder(id);
    const { uid, products } = orderData;
    const { role } = await findUserInDatabase(uid);
    if (price <= 0) {
      throw new APIError("Total price of order can't be 0 or less.", 400);
    }
    await updateTotalSpent(role, uid, price);
    await updateTotalOrder(role, uid);
    products.forEach(async (product) => {
      const { collection, foundProduct } = await findProductInDatabase(
        product.id
      );
      if (
        foundProduct.quantity < product.quantity ||
        foundProduct.quantity === 0
      ) {
        throw new APIError("Not enough stock", 400);
      }
      await updateProductStockInFirestore(
        collection,
        product.id,
        product.quantity
      );
      await updateTotalSold(collection, product.id, product.quantity);
    });

    await batch.commit();
    const order = (await orderRef.get()).data();

    return order;
  } catch (error) {
    logger.error("Error while updating order in firestore: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError("Error updating orders in database. " + error, 500);
  }
};
