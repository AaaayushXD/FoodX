import { z } from "zod";
import { roleSchema } from "../../auth/roleSchema.js";

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string({ required_error: "User id is required." })),
  role: roleSchema,
});

export type BulkDeleteSchemaType = z.infer<typeof bulkDeleteSchema>;
