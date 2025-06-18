import { z } from "zod";
import { addProductSchema } from "../../product/add/addProductSchema.js";
import { orderStatusSchema } from "../OrderStatusSchema.js";
import { roleSchema } from "../../auth/roleSchema.js";

export const AddOrderSchema = z.object({
  uid: z.string({ required_error: "User ID is required." }),
  products: z.array(
    z.object({
      id: z.string({ required_error: "Product ID is required," }),
      ...addProductSchema.shape,
    })
  ),
  status: orderStatusSchema,
  note: z.string().optional(),
  orderRequest: z.string({ required_error: "Order request is required." }),
  role: roleSchema.default("customer"),
  image: z.string().optional(),
  paymentMethod: z.enum(["online", "cash"]).default("cash"),
});

export type AddOrderSchemaType = z.infer<typeof AddOrderSchema>;
