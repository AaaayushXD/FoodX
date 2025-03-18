import { Router } from "express";
import { rateLimiter } from "../../middlewares/rateLimiter/rateLimiter.middlewares.js";
import {
  addFeedbacks,
  deleteFeedback,
  fetchFeedbacks,
  updateFeedback,
} from "./feedback.controllers.js";
import { validateRequest } from "../../middlewares/validator/validator.middleware.js";
import { FeedbackSchema } from "../../utils/validate/feedback/feedbackSchema.js";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import { PaginationSchema } from "../../utils/validate/pagination/paginationSchema.js";

const feedbackRouter = Router();

feedbackRouter.post(
  "/add",
  rateLimiter(60, 10),
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(FeedbackSchema),
  addFeedbacks
);
feedbackRouter.post(
  "/get",
  rateLimiter(60, 20),
  validateRequest(PaginationSchema),
  fetchFeedbacks
);
feedbackRouter.patch(
  "/update",
  rateLimiter(60, 10),
  verifyRoles(["admin", "chef", "customer"]),
  updateFeedback
);

feedbackRouter.delete(
  "/delete",
  rateLimiter(60, 10),
  verifyRoles(["admin", "chef", "customer"]),
  deleteFeedback
);
export { feedbackRouter };
