import { APIError } from "../../../helpers/error/ApiError.js";
import { paginateFnc } from "../../../helpers/paginate/paginate.js";

export const getOrdersFromDatabase = async (
  pageSize: number,
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  status?: "pending" | "preparing" | "prepared" | "completed" | "cancelled",
  userId?: string
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      "orders",
      "createdAt",
      startAfterDoc,
      startAtDoc,
      pageSize,
      "desc",
      direction,
      userId,
      status
    );
    const orderDoc = await query.get();
    const orders: Order.Order[] = [];

    orderDoc.docs.forEach((doc) => {
      orders.push(doc.data() as Order.Order);
    });

    const firstDoc = orderDoc.docs[0].data().orderId || null;
    const lastDoc =
      orderDoc.docs[orderDoc.docs.length - 1].data().orderId || null;

    return {
      orders,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    throw new APIError("Error fetching orders from database. " + error, 500);
  }
};
