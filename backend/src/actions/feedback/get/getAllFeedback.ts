import { APIError } from "../../../helpers/error/ApiError.js";
import { paginateFnc } from "../../../helpers/paginate/paginate.js";

export const fetchAllFeedback = async (
  pageSize: number,
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  userId?: string
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      "feedback",
      "createdAt",
      startAfterDoc,
      startAtDoc,
      pageSize,
      "desc",
      direction,
      userId
    );
    const feedbackDoc = await query.get();
    const feedbacks: Feedback.FeedbackDetail[] = [];

    feedbackDoc.docs.forEach((doc) => {
      feedbacks.push(doc.data() as Feedback.FeedbackDetail);
    });

    const firstDoc = feedbackDoc.docs[0].data().orderId || null;
    const lastDoc =
      feedbackDoc.docs[feedbackDoc.docs.length - 1].data().orderId || null;

    return {
      feedbacks,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    throw new APIError("Error fetching feedbacks from database. " + error, 500);
  }
};
