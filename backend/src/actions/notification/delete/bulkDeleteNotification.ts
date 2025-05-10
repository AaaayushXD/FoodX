import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const bulkDeleteNotificationsFromDatabase = async (id: string[]) => {
  const notificationRef = db.collection("notifications");
  if (!notificationRef)
    throw new APIError("No notifications collection available.", 404);
  try {
    const batch = db.batch();

    id.forEach((notificationId) => {
      const docRef = notificationRef.doc(notificationId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    logger.error("Error while deleting notifications in firestore: " + error);
    throw new APIError(
      "Unable to bulk delete notifications from database. " + error,
      500
    );
  }
};
