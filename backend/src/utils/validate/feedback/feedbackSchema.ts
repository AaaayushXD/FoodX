import { z } from "zod";

export const FeedbackSchema = z.object({
  uid: z.string({ required_error: "User ID is required." }),
  productId: z.string({ required_error: "Product ID is required." }),
  message: z
    .string({ required_error: "Message is required." })
    .min(4, { message: "Message must be at least 4 characters long." }),
  rating: z
    .number({ required_error: "Rating is required." })
    .min(1, { message: "Rating must be at least 1." }),
  image: z.string().optional(),
});

export type FeedbackSchemaType = z.infer<typeof FeedbackSchema>;
