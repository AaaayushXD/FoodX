import { Request, Response, NextFunction } from "express";
import { z } from "zod";
export const validateRequest = (schema: z.Schema<any>) => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
