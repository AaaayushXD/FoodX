import { Router } from "express";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import {
  addNewTicket,
  deleteTicket,
  fetchTickets,
  updateTicket,
} from "./ticket.controllers.js";
import { rateLimiter } from "../../middlewares/rateLimiter/rateLimiter.middlewares.js";
import { addTicketSchema } from "../../utils/validate/ticket/add/addTicketSchema.js";
import { validateRequest } from "../../middlewares/validator/validator.middleware.js";
import { PaginationSchema } from "../../utils/validate/pagination/paginationSchema.js";
const ticketRouter = Router();
ticketRouter.post(
  "/get-all",
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(PaginationSchema),
  fetchTickets
);

ticketRouter.post(
  "/add",
  rateLimiter(60, 10),
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(addTicketSchema),
  addNewTicket
);

ticketRouter.put(
  "/update",
  verifyRoles(["admin", "chef", "customer"]),
  updateTicket
);

ticketRouter.delete(
  "/:id",
  verifyRoles(["admin", "chef", "customer"]),
  deleteTicket
);

export { ticketRouter };
