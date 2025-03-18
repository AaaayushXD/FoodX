import { Router } from "express";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import {
  addNotification,
  deleteNotification,
  fetchNotifications,
} from "./notification.controllers.js";
import { validateRequest } from "../../middlewares/validator/validator.middleware.js";
import { createPaginationSchema } from "../../utils/validate/pagination/paginationSchema.js";

const notificationRouter = Router();

notificationRouter.post(
  "/add",
  verifyRoles(["admin", "chef", "customer"]),
  addNotification
);

notificationRouter.post(
  "/fetch",
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(
    createPaginationSchema({
      direction: true,
      userId: true
    })
  ),
  fetchNotifications
);

notificationRouter.delete(
  "/remove",
  verifyRoles(["admin", "chef", "customer"]),
  deleteNotification
);

export { notificationRouter };
