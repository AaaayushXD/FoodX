import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const addLogToFirestore = async (
  logs: Logs.LogData,
  role: "adminLogs" | "customerLogs" | "chefLogs"
) => {
  const logDocRef = db.collection(role);
  if (!logDocRef) throw new APIError(`Couldn't find ${role} collection.`, 404);
  try {
    const { uid, name, profile, detail, date, action } = logs;
    await logDocRef
      .add({
        id: "",
        uid,
        name,
        profile,
        detail: detail || "",
        date,
        action,
      })
      .then((docRef) => {
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
        });
      });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to add logs in database. " + error, 500);
  }
};
