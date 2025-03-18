import { Router } from "express";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import { addRevenueData, fetchRevenue } from "./revenue.controllers.js";
import { AddRevenueSchema } from "../../utils/validate/revenue/add/addRevenueSchema.js";
import { validateRequest } from "../../middlewares/validator/validator.middleware.js";

const revenueRouter = Router();

revenueRouter.post("/get", verifyRoles(["chef", "admin"]), fetchRevenue);
revenueRouter.post(
  "/add",
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(AddRevenueSchema),
  addRevenueData
);

export { revenueRouter };
