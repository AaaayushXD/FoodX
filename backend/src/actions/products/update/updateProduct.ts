import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { getProductById } from "../get/getProductById.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const updateProductInDatabase = async (
  collection: Product.Collection["name"],
  field: keyof Product.ProductData,
  id: string,
  newData: string | number
) => {
  const productRef = db.collection(collection);
  if (!productRef) throw new APIError("No collection available.", 400);
  try {
    const document = await getProductById(id, collection);
    await productRef.doc(document.doc).update({
      [`${field}`]: newData,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to update product data.", 400);
  }
};
