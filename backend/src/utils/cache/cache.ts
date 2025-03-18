import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("error", (error) => {
  console.error(`Redis client error:`, error);
});
await redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis successfully!");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

export { redisClient };
