import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { redisClient } from "../../utils/cache/cache.js";

const cacheMiddleware = (key: string) => {
  return asyncHandler(async (_: Request, res: Response, next: NextFunction) => {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      const response: API.ApiResponse = {
        status: 200,
        data: JSON.parse(cachedData),
        message: "Data from cache.",
        success: true,
      };

      return res.status(200).json(response);
    } else {
      next();
    }
  });
};

const cacheListMiddleware = (key: string, start: number, stop: number) => {
  return asyncHandler(async (_: Request, res: Response, next: NextFunction) => {
    const cachedData = await redisClient.lRange(key, start, stop);
    if (cachedData) {
      const parsedOrders = cachedData.map((data) => JSON.parse(data));
      const response: API.ApiResponse = {
        status: 200,
        data: parsedOrders,
        message: "Data list from cache.",
        success: true,
      };

      return res.status(200).json(response);
    } else {
      next();
    }
  });
};

export { cacheMiddleware, cacheListMiddleware };
