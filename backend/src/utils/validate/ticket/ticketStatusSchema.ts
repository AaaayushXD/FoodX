import { z } from "zod";

export const ticketStatusSchema = z.enum(["pending", "resolved", "cancelled"]);

export type TicketStatusSchemaType = z.infer<typeof ticketStatusSchema>;
