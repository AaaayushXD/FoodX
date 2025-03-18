declare namespace Feedback {
  interface FeedbackInfo {
    userId: string;
    productId: string;
    rating: number;
    message: string;
    image?: string;
  }

  interface FeedbackDetail extends FeedbackInfo {
    id: string;
    createdAt: string;
    updatedAt: string;
  }
}
