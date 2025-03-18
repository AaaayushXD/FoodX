import { z } from "zod";

export const updateProductSchema = z.object({
  id: z.string().min(1, { message: "ID is required." }),
  field: z.string().min(1, { message: "Field is required." }),
  newData: z.string().or(z.number()),
});

export type updateProductSchemaType = z.infer<typeof updateProductSchema>;
