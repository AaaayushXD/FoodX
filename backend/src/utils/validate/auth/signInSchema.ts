import { z } from "zod";
import { roleSchema } from "./roleSchema.js";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .endsWith(`@${process.env.COLLEGE_DOMAIN}`),
  password: z
    .string({ required_error: "Passsword is required." })
    .min(8, { message: "Password must be atleast 8 character long." })
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain an uppercase character, a digit and a special symbol."
    ),
  role: roleSchema.default("customer"),
});

export type signInSchema = z.infer<typeof signInSchema>;
