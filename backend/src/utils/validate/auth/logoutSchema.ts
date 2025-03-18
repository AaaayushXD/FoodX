import { z } from "zod";
import { roleSchema } from "./roleSchema.js";

export const LogoutSchema = z.object({
  uid: z.string({ required_error: "User id is required." }).refine(
    (value) => {
      return value.length > 0;
    },
    { message: "User id cannot be empty." }
  ),
  role: roleSchema.default("customer"),
});

export type LogoutSchemaType = z.infer<typeof LogoutSchema>;
