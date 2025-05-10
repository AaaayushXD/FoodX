import { Router } from "express";
import { Login } from "./login/login.controllers.js";
import { rateLimiter } from "../middlewares/rateLimiter/rateLimiter.middlewares.js";
import { verifyRoles } from "../middlewares/auth/auth.middlewares.js";
import { logOutUser } from "./logout/logout.controllers.js";
import { refreshAccessToken } from "./refresh/refresh.controllers.js";
import { SignUp } from "./signup/signup.controllers.js";
import { verifyOtp } from "./verify/verify.controllers.js";
import { validateRequest } from "../middlewares/validator/validator.middleware.js";
import { signInSchema } from "../utils/validate/auth/signInSchema.js";
import { signUpSchema } from "../utils/validate/auth/signUpSchema.js";
import { LogoutSchema } from "../utils/validate/auth/logoutSchema.js";
import { ChangePassword } from "./password/password.controllers.js";
import { VerifyOtpSchema } from "../utils/validate/auth/verifyOtpSchema.js";
import { resetPasswordController } from "./reset/reset.controllers.js";
import { resendOtpController } from "./resend/resend.controllers.js";

const authRouter = Router();

authRouter.post("/login", validateRequest(signInSchema), Login);
authRouter.post("/sign-up", validateRequest(signUpSchema), SignUp);
authRouter.post(
  "/logout",
  rateLimiter(60, 5),
  verifyRoles(["admin", "chef", "customer"]),
  validateRequest(LogoutSchema),
  logOutUser
);
authRouter.post("/refresh", rateLimiter(60, 5), refreshAccessToken);
authRouter.post(
  "/verify",
  verifyRoles(["admin", "chef", "customer"]),
  rateLimiter(60, 10),
  validateRequest(VerifyOtpSchema),
  verifyOtp
);
authRouter.post(
  "/change-password",
  verifyRoles(["admin", "chef", "customer"]),
  rateLimiter(60, 10),
  ChangePassword
);
authRouter.post(
  "/reset",
  rateLimiter(60, 10),
  resetPasswordController
);
authRouter.post("/resend", rateLimiter(60, 1), resendOtpController);
export { authRouter };
