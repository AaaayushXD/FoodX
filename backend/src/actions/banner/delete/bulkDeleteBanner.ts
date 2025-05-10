import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const bulkDeleteBannersFromDatabase = async (
  id: string[],
  collection: string
) => {
  const bannerRef = db.collection("banners");
  if (!bannerRef) throw new APIError("No banners collection available.", 404);
  try {
    const batch = db.batch();

    id.forEach((bannerId) => {
      const docRef = bannerRef.doc(bannerId);
      batch.delete(docRef);
    });
    await batch.commit();
    return collection;
  } catch (error) {
    logger.error(
      `Error bulk deleting banners with ids: ${error}`
    );
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Unable to bulk delete banners from database. " + error,
      500
    );
  }
};
