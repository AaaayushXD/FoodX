import { Router } from "express";
import { rateLimiter } from "../../middlewares/rateLimiter/rateLimiter.middlewares.js";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import {
  deleteAccount,
  deleteUser,
  deleteUsersInBulk,
  fetchUsers,
  getSearchUser,
  getUser,
  updateAccount,
  updateUser,
  updateUserRole,
} from "./user.controllers.js";
import { validateRequest } from "../../middlewares/validator/validator.middleware.js";
import {
  accountUpdateSchema,
  userRoleUpdateSchema,
  userUpdateSchema,
} from "../../utils/validate/user/update/user.update.schema.js";
import { userSchema } from "../../utils/validate/user/user.schema.js";
import { bulkDeleteSchema } from "../../utils/validate/user/delete/bulk-delete.schema.js";
import { PaginationSchema } from "../../utils/validate/pagination/paginationSchema.js";

const userRouter = Router();

userRouter.get("/find", verifyRoles(["admin"]), getSearchUser);

userRouter.delete(
  "/delete-account",
  rateLimiter(60, 5),
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(userSchema),
  deleteAccount
);

userRouter.put(
  "/update-account",
  rateLimiter(60, 5),
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(accountUpdateSchema),
  updateAccount
);

userRouter.post(
  "/get-users",
  verifyRoles(["admin"]),
  validateRequest(PaginationSchema),
  fetchUsers
);

userRouter.delete(
  "/delete-user",
  rateLimiter(60, 10),
  verifyRoles(["admin"]),
  validateRequest(userSchema),
  deleteUser
);

userRouter.put(
  "/update-user",
  rateLimiter(60, 5),
  verifyRoles(["admin"]),
  validateRequest(userUpdateSchema),
  updateUser
);

userRouter.put(
  "/update-role",
  verifyRoles(["admin"]),
  rateLimiter(60, 5),
  validateRequest(userRoleUpdateSchema),
  updateUserRole
);

userRouter.delete(
  "/bulk-delete",
  verifyRoles(["admin"]),
  rateLimiter(60, 5),
  validateRequest(bulkDeleteSchema),
  deleteUsersInBulk
);

userRouter.get("/:role", getUser);
export { userRouter };
