import { Router } from "express";
import {
  addNewBanner,
  deleteBanner,
  deleteBannersInBulk,
  getAllBanners,
} from "./banner.controllers.js";
import { cacheMiddleware } from "../../middlewares/cache/cache.middleware.js";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import { validateRequest } from "../../middlewares/validator/validator.middleware.js";
import { BannerSchema } from "../../utils/validate/banner/bannerSchema.js";

const bannerRouter = Router();

bannerRouter.get("/:path", cacheMiddleware("banner"), getAllBanners);
bannerRouter.post(
  "/add-banner",
  verifyRoles(["chef", "admin"]),
  validateRequest(BannerSchema),
  addNewBanner
);
bannerRouter.delete(
  "/delete-banner",
  verifyRoles(["chef", "admin"]),
  deleteBanner
);
bannerRouter.delete(
  "/bulk-delete",
  verifyRoles(["chef", "admin"]),
  deleteBannersInBulk
);

export { bannerRouter };
