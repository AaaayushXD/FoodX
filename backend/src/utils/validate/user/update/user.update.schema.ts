import { z } from "zod";
import { roleSchema } from "../../auth/roleSchema.js";
import { userSchema } from "../user.schema.js";

export const accountUpdateSchema = z.object({
  fullName: z.string({ required_error: "First name is required." }).optional(),
  phoneNumber: z
    .string({ required_error: "Phone number is required." })
    .optional(),
  avatar: z.string({ required_error: "Avatar is required." }).optional(),
});

export const userUpdateSchema = z.object({
  ...userSchema.shape,
  ...accountUpdateSchema.shape,
});

export const userRoleUpdateSchema = z.object({
  ...userSchema.shape,
  newRole: roleSchema,
});

export type UserUpdateSchemaType = z.infer<typeof userUpdateSchema>;

export type AccountUpdateSchemaType = z.infer<typeof accountUpdateSchema>;

export type UserRoleUpdateSchemaType = z.infer<typeof userRoleUpdateSchema>;
