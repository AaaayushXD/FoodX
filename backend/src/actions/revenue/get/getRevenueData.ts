import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
export const getRevenueDataFromFirestore = async (
  startDate: string,
  endDate?: string
) => {
  try {
    const query = db.collection("revenue");
    let querySnapShot;
    if (startDate && endDate) {
      querySnapShot = await query
        .where("id", ">=", startDate)
        .where("id", "<=", endDate)
        .get();
    } else {
      querySnapShot = await query.where("id", "==", startDate).get();
    }
    const revenue: Revenue.RevenueInfo[] = [];

    if (querySnapShot.empty) {
      return revenue;
    }

    querySnapShot?.docs.forEach((doc) => {
      revenue.push(doc.data() as Revenue.RevenueInfo);
    });
    return revenue;
  } catch (error) {
    throw new APIError(
      "Something went wrong while fetching revenue from database. " + error,
      500
    );
  }
};
