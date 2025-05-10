import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const addFeedback = async (feedback: Feedback.FeedbackInfo) => {
  const { uid, productId, message, rating, image } = feedback;

  try {
    const docRef = db.collection("feedback");
    if (!docRef) throw new APIError("No feedback collection found.", 404);

    const id = await docRef
      .add({
        uid,
        productId,
        message,
        rating,
        image: image ? image : "",
      })
      .then((docData) => {
        docData.update({
          id: docData.id,
          createdAt: FieldValue.serverTimestamp(),
        });
        return docData.id;
      });

    const doc = await docRef.doc(id).get();
    return doc.data() as Feedback.FeedbackDetail;
  } catch (error) {
    logger.error("Error while adding feedback in firestore: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while adding feedback in firestore. " + error,
      500
    );
  }
};
