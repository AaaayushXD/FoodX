import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const getProductById = async (
  id: string,
  collection: Product.Collection["name"]
) => {
  const productRef = db.collection(collection);
  try {
    const doc = await productRef.doc(id).get();
    if (!doc.exists) throw new APIError("No item found with that ", 400);
    const data = doc.data() as Product.ProductInfo;
    return { data, doc: id };
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to get product from database.", 400);
  }
};
