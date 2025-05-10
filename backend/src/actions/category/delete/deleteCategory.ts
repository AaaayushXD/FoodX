import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const deleteCategoryFromDatabase = async (id: string) => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new APIError("No category collection found.", 404);
  try {
    const category = await categoryRef.doc(id).delete();
    return category;
  } catch (error) {
    logger.error(`Error deleting category: ${error}`);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Unable to delete category data from database. " + error,
      500
    );
  }
};
