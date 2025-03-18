import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const getProductByTagFromDatabase = async (
  tagId: string,
  category: Product.Collection["name"]
) => {
  const productRef = db.collection(category);
  if (!productRef) throw new APIError("No collection available.", 404);
  try {
    const products: Product.ProductInfo[] = [];
    const query = productRef.where("tagId", "==", tagId);
    const snapshot = await query.get();
    snapshot.forEach((doc) => {
      if (!doc.exists) throw new APIError("Document doesnt exist.", 404);
      const data = doc.data() as Product.ProductInfo;
      products.push(data);
    });
    return products;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to get products  by tag. " + error, 500);
  }
};
