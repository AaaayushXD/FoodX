import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const updateCategoryInDatabase = async (
  id: string,
  field: "name" | "image" | "bannerImage" | "description",
  newData: string
) => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new APIError("No category collection found.", 404);
  try {
    const category = await categoryRef.doc(id).update({
      [`${field}`]: newData,
      updatedAt: FieldValue.serverTimestamp(),
    });
    return category;
  } catch (error) {
    logger.error(`Error updating category: ${error}`);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Unable to update category data in database. " + error,
      500
    );
  }
};
