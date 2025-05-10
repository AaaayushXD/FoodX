import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const updateFeedbackInDatabase = async (
  id: string,
  field: keyof Feedback.FeedbackInfo,
  newData: string | number,
  uid: string
) => {
  try {
    const docRef = db.collection("feedback").doc(id);
    if (!docRef) throw new APIError("No feedback collection found.", 404);
    const feedbackDoc = await docRef.get();
    if (!feedbackDoc.exists) throw new APIError("Feedback not found.", 404);

    const feedbackData = feedbackDoc.data() as Feedback.FeedbackDetail;

    if (feedbackData.userId !== uid)
      throw new APIError(
        "You are not authorized to update this feedback.",
        403
      );

    await docRef.update({
      [`${field}`]: newData,
      updatedAt: FieldValue.serverTimestamp(),
    });
    const doc = await docRef.get();
    return doc.data() as Feedback.FeedbackDetail;
  } catch (error) {
    logger.error("Error while updating feedback in firestore: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while updating feedback. " + error,
      500
    );
  }
};
