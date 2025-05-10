import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const bulkDeleteCategoryFromDatabase = async (id: string[]) => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new APIError("No collection available.", 404);
  try {
    const batch = db.batch();

    id.forEach((categoryId) => {
      const docRef = categoryRef.doc(categoryId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    logger.error(`Error bulk deleting categories with ids: ${error}`);
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to bulk delete categories data. " + error, 500);
  }
};
