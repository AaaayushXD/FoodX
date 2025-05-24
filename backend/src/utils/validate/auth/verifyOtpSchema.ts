import { z } from "zod";

export const VerifyOtpSchema = z.object({
  code: z.string().length(6, { message: "Invalid otp." }),
  uid: z.string(),
  type: z.enum(["otp", "reset"])
});

export type VerifyOtpSchemaType = z.infer<typeof VerifyOtpSchema>;
