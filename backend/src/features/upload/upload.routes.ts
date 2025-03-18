import { Router } from "express";
import { upload } from "../../middlewares/storage/multer.middleware.js";
import { Upload } from "./upload.controllers.js";

const uploadRouter = Router();

uploadRouter.post("/upload", upload.single("image"), Upload);

export { uploadRouter };
