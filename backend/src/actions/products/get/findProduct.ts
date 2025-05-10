import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const findProductInDatabase = async (id: string) => {
  const collections: ["products", "specials"] = ["products", "specials"];
  let foundProduct: Product.ProductInfo | undefined = undefined;
  let collectionName: Product.Collection["name"] = "products";
  try {
    for (const collection of collections) {
      const docRef = db.collection(collection).doc(id);
      const doc = await docRef.get();

      if (doc.exists) {
        foundProduct = doc.data() as Product.ProductInfo;
        collectionName = collection;
        break;
      }
    }
    if (!foundProduct) throw new APIError("Product not found.", 404);
    return { foundProduct, collection: collectionName };
  } catch (error) {
    logger.error("Error while finding product: " + error);
    throw new APIError("Error finding product in database. " + error, 500);
  }
};
