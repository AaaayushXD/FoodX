import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const addNewCategoryInDatabase = async (
  name: string,
  image: string,
  bannerImage: string,
  description?: string
) => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new APIError("No category collection found.", 404);
  try {
    const category = await categoryRef
      .add({
        id: "",
        name,
        image,
        bannerImage,
        description: description ? description : "",
      })
      .then((docRef) =>
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: null,
        })
      );
    return category;
  } catch (error) {
    logger.error(`Error adding category: ${error}`);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Unable to add category data in database. " + error,
      500
    );
  }
};
