import rateLimit from "express-rate-limit";

export const rateLimiter = (limitTime: number, limitRequestAmount: number) => {
  return rateLimit({
    windowMs: limitTime * 1000,
    max: limitRequestAmount,
    message: "Too many requests. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.ip || "";
    },
    skip: (req) => {
      return req.path === "/health" || req.path === "/status";
    },
  });
};
