import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { rootRouter } from "./routes/root.routes.js";
import { initializeSocket } from "./utils/socket/index.js";
import errorHandler from "./middlewares/error/errorHandler.js";
import logger from "./utils/logger/logger.js";
dotenv.config();

const app = express();

app.get("/test", (_, res) => {
  res.status(200).send("Running on server.");
});

app.use(cors());
app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use("/assets", express.static("uploads"));

app.use("/assets", (_, res) => {
  res.status(404).json({
    message: "Asset not found",
    success: false,
    status: 404,
    data: null,
  });
});

const { io, server } = initializeSocket(app);
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

app.get("/health", (_, res) => {
  res.status(200).json({
    message: "Server is healthy",
    success: true,
    status: 200,
    data: null,
  });
});

//route handling
app.use("/api/v1", rootRouter);

app.use(errorHandler);

export default app;
export { io };
