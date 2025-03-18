import { z } from "zod";
import { ticketStatusSchema } from "../ticketStatusSchema.js";

export const addTicketSchema = z.object({
  uid: z.string({
    required_error: "User ID is required.",
  }),
  title: z.string({
    required_error: "Title is required.",
  }),
  description: z.string({
    required_error: "Description is required.",
  }),
  status: ticketStatusSchema,
  category: z.string({
    required_error: "Category is required.",
  }),
  date: z.string({
    required_error: "Date is required.",
  }),
});

export type AddTicketSchemaType = z.infer<typeof addTicketSchema>;
