import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const getAllProductsFromDatabase = async (
  collection: Product.Collection["name"]
) => {
  const productRef = db.collection(collection);
  if (!productRef) throw new APIError("No collection available.", 404);
  try {
    const products: Product.ProductInfo[] = [];
    const documents = await productRef.get();
    documents.forEach((doc) => {
      if (!doc.exists) throw new APIError("Document doesnt exist.", 404);
      const data = doc.data() as Product.ProductInfo;
      products.push(data);
    });
    return products;
  } catch (error) {
    logger.error("Error while getting all products: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to get product from database. " + error, 500);
  }
};
