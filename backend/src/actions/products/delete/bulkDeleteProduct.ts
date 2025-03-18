import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const bulkDeleteProductsFromDatabase = async (
  collection: Product.Collection["name"],
  ids: string[]
) => {
  const productRef = db.collection(collection);
  if (!productRef) throw new APIError("No collection available.", 400);
  try {
    const batch = db.batch();

    ids.forEach((productId) => {
      const docRef = productRef.doc(productId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to bulk delete product data.", 400);
  }
};
