import { createClient } from "redis";
import logger from "../logger/logger.js";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("error", (error) => {
  logger.error(`Redis client error:`, error);
  console.error(`Redis client error:`, error);
});
await redisClient
  .connect()
  .then(() => {
    logger.info("Connected to Redis successfully!");
  })
  .catch((err) => {
    logger.error("Failed to connect to Redis:", err);
    console.error("Failed to connect to Redis:", err);
  });

export { redisClient };
