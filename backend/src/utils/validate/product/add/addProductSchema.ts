import { z } from "zod";

export const addProductSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." }),
  quantity: z.number().min(0, { message: "Quantity must be greater than 0." }),
  price: z.number().min(0, { message: "Price must be greater than 0." }),
  image: z.string().min(1, { message: "Image is required." }),
  tagId: z.string().min(1, { message: "Tag ID is required." }),
  totalSold: z.number().optional(),
  description: z.string().min(1, { message: "Description is required." }),
  cookingTime: z.string().min(1, { message: "Cooking time is required." }),
  rating: z.string().min(1, { message: "Rating is required." }),
  bannerImage: z.string().optional(),
});

export type addProductSchemaType = z.infer<typeof addProductSchema>;
