import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const getProductByName = async (
  name: string,
  category: Product.Collection["name"]
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new APIError("No document found.", 404);
  try {
    const query = productRef.where("name", "==", name);
    const res = await query.get();
    if (!res) throw new APIError("No item found with that name.", 404);
    const doc = res.docs[0];
    const data = doc.data() as Product.ProductInfo;
    return { data, doc: doc.id };
  } catch (error) {
    logger.error("Error while getting product: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to get product from database.", 500);
  }
};
