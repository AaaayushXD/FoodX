import { Router } from "express";
import { cacheMiddleware } from "../../middlewares/cache/cache.middleware.js";
import { rateLimiter } from "../../middlewares/rateLimiter/rateLimiter.middlewares.js";
import { verifyRoles } from "../../middlewares/auth/auth.middlewares.js";
import {
  addProduct,
  deleteProduct,
  deleteProductsInBulk,
  getAllProducts,
  getPopularProducts,
  getProductByTag,
  getSpecialProducts,
  productContGetProductById,
  searchProduct,
  updateProduct,
} from "./product.controllers.js";
import { validateRequest } from "../../middlewares/validator/validator.middleware.js";
import { addProductSchema } from "../../utils/validate/product/add/addProductSchema.js";
import { updateProductSchema } from "../../utils/validate/product/update/updateProductSchema.js";

const productRouter = Router();

productRouter.get("/", searchProduct);
productRouter.get("/specials", cacheMiddleware("specials"), getSpecialProducts);

productRouter.get(
  "/popular",
  cacheMiddleware("popular_products"),
  rateLimiter(60, 20),
  getPopularProducts
);

productRouter.get("/all", cacheMiddleware("products"), getAllProducts);
productRouter.get("/:id", productContGetProductById);
productRouter.post(
  "/add/:collection",
  rateLimiter(60, 20),
  verifyRoles(["chef", "admin"]),
  validateRequest(addProductSchema),
  addProduct
);

productRouter.put(
  "/update/:collection",
  rateLimiter(60, 20),
  verifyRoles(["chef", "admin"]),
  validateRequest(updateProductSchema),
  updateProduct
);

productRouter.delete(
  "/delete/:collection",
  rateLimiter(60, 20),
  verifyRoles(["chef", "admin"]),
  deleteProduct
);

productRouter.delete(
  "/bulk-delete/:collection",
  rateLimiter(60, 5),
  verifyRoles(["chef", "admin"]),
  deleteProductsInBulk
);

productRouter.get(
  "/product-tag/:tag",
  (req, res, next) => {
    const tag = req?.params.tag;
    cacheMiddleware(`product:${tag}`)(req, res, next);
  },
  getProductByTag
);
export { productRouter };
