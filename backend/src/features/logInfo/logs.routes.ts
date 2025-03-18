import { Router } from "express";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import { addLogs, fetchLogs } from "./logs.controllers.js";

const logRouter = Router();

logRouter.post(
  "/add-logs",
  verifyRoles(["admin", "chef", "customer"]),
  addLogs
);
logRouter.post("/get-logs", verifyRoles(["admin"]), fetchLogs);

export { logRouter };
