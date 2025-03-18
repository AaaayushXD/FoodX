import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
export const deleteProductFromDatabase = async (
  uid: string,
  collection: Product.Collection["name"]
) => {
  const productRef = db.collection(collection);
  if (!productRef) throw new APIError("No collection available", 400);
  try {
    await productRef.doc(uid).delete();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to delete product. " + error, 400);
  }
};
