import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";


export const updateFeedbackInDatabase = async (
  id: string,
  field: keyof Feedback.FeedbackInfo,
  newData: string | number
) => {
  try {
    const docRef = db.collection("feedback").doc(id);
    if (!docRef) throw new APIError("No feedback collection found.", 404);
    await docRef.update({
      [`${field}`]: newData,
      updatedAt: FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    return doc.data() as Feedback.FeedbackDetail;
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while updating feedback. " + error,
      500
    );
  }
};
