import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { redisClient } from "../../utils/cache/cache.js";

export const rateLimiter = (limitTime: number, limitRequestAmount: number) => {
  return asyncHandler(async (req: Request, _: Response, next: NextFunction) => {
    const ip =
      req.ip ||
      ((req.headers["x-forwarded-for"] as string) || "")
        .split(",")
        .shift()
        ?.trim() ||
      req.socket.remoteAddress;

    const endpoint = req.originalUrl;
    const key = `${ip}:${endpoint}`;
    const response = await redisClient
      .multi()
      .incr(key)
      .expire(key, limitTime)
      .exec();
    if (response && (response[0] as number) > limitRequestAmount) {
      throw new Error("Too many requests. Please try again later. ");
    }
    next();
  });
};
