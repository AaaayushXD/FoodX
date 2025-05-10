import { APIError } from "../../../helpers/error/ApiError.js";
import { paginateFnc } from "../../../helpers/paginate/paginate.js";
import logger from "../../../utils/logger/logger.js";

export const getNotificationsFromDatabase = async (
  pageSize: number,
  sort: "asc" | "desc" = "desc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  userId?: string
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      "notifications",
      "createdAt",
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction,
      userId
    );
    const notificationDoc = await query.get();
    const notifications: Notification.NotificationDetail[] = [];

    if (notificationDoc.empty) {
      return {
        notifications,
        firstDoc: null,
        lastDoc: null,
        length: 0,
      };
    }

    notificationDoc.docs.forEach((doc) => {
      notifications.push(doc.data() as Notification.NotificationDetail);
    });

    const firstDoc = notificationDoc.docs[0]?.data().id || null;
    const lastDoc =
      notificationDoc.docs[notificationDoc.docs.length - 1]?.data().id || null;
    return {
      notifications,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    logger.error("Error while fetching notifications in firestore: " + error);
    throw new APIError(
      "Error fetching notifications from database. " + error,
      500
    );
  }
};
