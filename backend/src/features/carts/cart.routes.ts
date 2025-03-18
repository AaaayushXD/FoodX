import { Router } from "express";
import { rateLimiter } from "../../middlewares/rateLimiter/rateLimiter.middlewares.js";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import { addCarts, getCarts, removeCarts } from "./cart.controllers.js";

const cartRouter = Router();

cartRouter.get("/:uid", verifyRoles(["customer", "chef", "admin"]), getCarts);

cartRouter.post(
  "/add",
  rateLimiter(60, 30),
  verifyRoles(["customer", "chef", "admin"]),
  addCarts
);
cartRouter.delete(
  "/remove",
  rateLimiter(60, 20),
  verifyRoles(["customer", "admin", "chef"]),
  removeCarts
);

export { cartRouter };
