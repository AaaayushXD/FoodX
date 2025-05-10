import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const getPopularProductsFromDatabase = async () => {
  try {
    const normalProductRef = db
      .collection("products")
      .orderBy("totalSold", "desc")
      .limit(5);
    const specialProductRef = db
      .collection("specials")
      .orderBy("totalSold", "desc")
      .limit(5);

    const normalProducts = await normalProductRef.get();
    const specialProducts = await specialProductRef.get();
    if (normalProducts.empty && specialProducts.empty) return [];

    let result: Product.ProductInfo[] = [
      ...normalProducts.docs.map((doc) => ({
        ...(doc.data() as Product.ProductInfo),
      })),
      ...specialProducts.docs.map((doc) => ({
        ...(doc.data() as Product.ProductInfo),
      })),
    ];

    result.sort((a, b) => {
      if (a.totalSold === b.totalSold) return 0;
      return a.totalSold > b.totalSold ? -1 : 1;
    });

    return result;
  } catch (error) {
    logger.error("Error while getting popular products: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Error getting popular product from database. " + error,
      500
    );
  }
};
