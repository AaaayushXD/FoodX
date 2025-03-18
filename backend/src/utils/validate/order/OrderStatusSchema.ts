import { z } from "zod";

export const orderStatusSchema = z.enum([
  "pending",
  "preparing",
  "prepared",
  "completed",
  "cancelled",
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;
