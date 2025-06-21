import { z } from "zod";
import { roleSchema } from "./roleSchema.js";

export const signUpSchema = z.object({
  email: z.string({ required_error: "Email is required." }),
  password: z
    .string({ required_error: "Passsword is required." })
    .min(8, { message: "Password must be atleast 8 character long." }),
  role: roleSchema.default("customer"),
  avatar: z.string({ required_error: "Avatar is required." }),
  firstName: z
    .string({ required_error: "First name is required." }),
  lastName: z
    .string({ required_error: "Last name is required." }),
  phoneNumber: z
    .string({ required_error: "Phone number is required." })
    .min(10, { message: "Phone number must be atleast 10 character long." }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
