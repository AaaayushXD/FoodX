import { z } from "zod";
import { addProductSchema } from "../../product/add/addProductSchema.js";

export const AddRevenueSchema = z.object({
  id: z.string({ required_error: "ID is required." }),
  orders: z.array(
    z.object({
      id: z.string({ required_error: "Product ID is required." }),
      ...addProductSchema.shape,
    })
  ),
});

export type AddRevenueSchemaType = z.infer<typeof AddRevenueSchema>;
