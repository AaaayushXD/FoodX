import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import { generateRandomId } from "../../../utils/random/randomId.js";
import logger from "../../../utils/logger/logger.js";

export const addProductToFirestore = async (
  product: Product.ProductData,
  category: Product.Collection["name"]
) => {
  if (!product) throw new APIError("No data to update the database.", 400);
  const productRef = db.collection(category);
  if (!productRef) throw new APIError("No document found.", 400);
  try {
    const id = generateRandomId();
    const {
      image,
      name,
      price,
      quantity,
      tagId,
      cookingTime,
      description,
      rating,
      bannerImage,
    } = product;
    await productRef
      .add({
        id,
        name,
        price,
        image,
        quantity,
        tagId,
        totalSold: 0,
        cookingTime: cookingTime ? cookingTime : null,
        description: description ? description : null,
        rating: rating ? rating : 0,
        bannerImage: bannerImage ? bannerImage : null,
      })
      .then((docRef) =>
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        })
      );
  } catch (error) {
    logger.error(": Error while adding product: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while adding product to the database.",
      500
    );
  }
};
