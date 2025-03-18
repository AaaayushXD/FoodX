import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const addNotificationToDatabase = async (
  uid: string,
  title: string,
  message: string
) => {
  const notificationRef = db.collection("notifications");
  if (!notificationRef)
    throw new APIError("No notifications collection found.", 404);
  try {
    const notifications = await notificationRef
      .add({
        id: "",
        title,
        uid,
        message,
      })
      .then((docRef) =>
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        })
      );
    return notifications;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to add notification in database. " + error, 500);
  }
};
