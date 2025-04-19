import { Router } from "express";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import { rateLimiter } from "../../middlewares/rateLimiter/rateLimiter.middlewares.js";
import {
  addNewOrder,
  fetchOrders,
  searchOrderBasedOnUid,
  getOrderByUserIdFromDatabase,
  updateOrder,
  orderContGetOrder,
} from "./order.controllers.js";
import { AddOrderSchema } from "../../utils/validate/order/add/addOrderSchema.js";
import { validateRequest } from "../../middlewares/validator/validator.middleware.js";
import { UpdateOrderSchema } from "../../utils/validate/order/update/updateOrderSchema.js";
import { createPaginationSchema } from "../../utils/validate/pagination/paginationSchema.js";
const orderRoutes = Router();

orderRoutes.post(
  "/user-order",
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(
    createPaginationSchema({
      userId: true,
      status: true,
      direction: true,
    })
  ),
  getOrderByUserIdFromDatabase
);

orderRoutes.post(
  "/add",
  rateLimiter(60, 5),
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(AddOrderSchema),
  addNewOrder
);

orderRoutes.put(
  "/update",
  rateLimiter(60, 5),
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(UpdateOrderSchema),
  updateOrder
);

orderRoutes.post(
  "/get-orders",
  verifyRoles(["chef", "admin"]),
  validateRequest(
    createPaginationSchema({
      status: false,
      direction: true,
    })
  ),
  fetchOrders
);

orderRoutes.post(
  "/find",
  verifyRoles(["admin", "chef"]),
  validateRequest(
    createPaginationSchema({
      status: true,
      direction: true,
      userId: true,
    })
  ),
  searchOrderBasedOnUid
);

orderRoutes.get(
  "/:id",
  verifyRoles(["admin", "chef", "customer"]),
  orderContGetOrder
);

export { orderRoutes };
