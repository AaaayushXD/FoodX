import { Router } from "express";
import { cacheMiddleware } from "../../middlewares/cache/cache.middleware.js";
import { rateLimiter } from "../../middlewares/rateLimiter/rateLimiter.middlewares.js";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import {
  addNewCategory,
  deleteCategoriesInBulk,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "./category.controllers.js";

const categoryRouter = Router();

categoryRouter.get(
  "/get",
  cacheMiddleware("category"),
  getAllCategory
);

categoryRouter.post(
  "/add",
  rateLimiter(60, 30),
  verifyRoles(["chef", "admin"]),
  addNewCategory
);

categoryRouter.put(
  "/update",
  rateLimiter(60, 50),
  verifyRoles(["chef", "admin"]),
  updateCategory
);

categoryRouter.delete(
  "/delete",
  rateLimiter(60, 15),
  verifyRoles(["chef", "admin"]),
  deleteCategory
);
categoryRouter.delete(
  "/bulk-delete",
  rateLimiter(60, 10),
  verifyRoles(["chef", "admin"]),
  deleteCategoriesInBulk
);

export { categoryRouter };
