import { z } from "zod";
import { roleSchema } from "./roleSchema.js";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required." }),
  password: z
    .string({ required_error: "Passsword is required." })
    .min(8, { message: "Password must be atleast 8 character long." }),
  role: roleSchema.default("customer"),
});

export type signInSchema = z.infer<typeof signInSchema>;
