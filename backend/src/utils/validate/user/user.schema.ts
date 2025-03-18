import { z } from "zod";
import { roleSchema } from "../auth/roleSchema.js";

export const userSchema = z.object({
  uid: z.string({ required_error: "User id is required." }),
  role: roleSchema,
});

export type UserSchemaType = z.infer<typeof userSchema>;
