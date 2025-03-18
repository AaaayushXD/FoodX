import { Router } from "express";
import { authRouter } from "../auth/auth.routes.js";
import { bannerRouter } from "../features/banners/banner.routes.js";
import { cartRouter } from "../features/carts/cart.routes.js";
import { categoryRouter } from "../features/categories/category.routes.js";
import { favouriteRouter } from "../features/favourites/favourite.routes.js";
import { logRouter } from "../features/logInfo/logs.routes.js";
import { notificationRouter } from "../features/notifications/notification.routes.js";
import { orderRoutes } from "../features/orders/order.routes.js";
import { productRouter } from "../features/products/product.routes.js";
import { revenueRouter } from "../features/revenues/revenue.routes.js";
import { ticketRouter } from "../features/tickets/ticket.routes.js";
import { userRouter } from "../features/users/user.routes.js";
import { uploadRouter } from "../features/upload/upload.routes.js";
import { feedbackRouter } from "../features/feedback/feedback.routes.js";

const rootRouter = Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/products", productRouter);
rootRouter.use("/cart", cartRouter);
rootRouter.use("/orders", orderRoutes);
rootRouter.use("/tickets", ticketRouter);
rootRouter.use("/logs", logRouter);
rootRouter.use("/categories", categoryRouter);
rootRouter.use("/banners", bannerRouter);
rootRouter.use("/revenue", revenueRouter);
rootRouter.use("/favourites", favouriteRouter);
rootRouter.use("/notification", notificationRouter);
rootRouter.use("/feedback", feedbackRouter);
rootRouter.use("/images", uploadRouter)

export { rootRouter };
