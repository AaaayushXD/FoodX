import { z } from "zod";

export const roleSchema = z.enum(["customer", "admin", "chef"]);

export type Role = z.infer<typeof roleSchema>;
