import { Router } from "express";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import { rateLimiter } from "../../middlewares/rateLimiter/rateLimiter.middlewares.js";
import {
  addFavourite,
  getFavourites,
  removeFavourites,
} from "./favourite.controllers.js";
import { cacheMiddleware } from "../../middlewares/cache/cache.middleware.js";

const favouriteRouter = Router();

favouriteRouter.post(
  "/add",
  rateLimiter(60, 30),
  verifyRoles(["customer", "admin", "chef"]),
  addFavourite
);

favouriteRouter.delete(
  "/remove",
  rateLimiter(60, 20),
  verifyRoles(["customer", "admin", "chef"]),
  removeFavourites
);

favouriteRouter.get(
  "/:uid",
  verifyRoles(["customer", "admin", "chef"]),
  cacheMiddleware("favourites"),
  getFavourites
);

export { favouriteRouter };
