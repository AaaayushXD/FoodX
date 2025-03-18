import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { APIError } from "../../helpers/error/ApiError.js";

const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  let response: API.ApiResponse;

  if (err instanceof ZodError) {
    const errorDetails = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    response = {
      status: 400,
      data: null,
      message: "Validation Error",
      success: false,
      errors: errorDetails,
    };
    return res.status(400).json(response);
  }

  if (err instanceof APIError) {
    response = {
      status: err.statusCode,
      data: null,
      message: err.message || "Internal Server Error",
      success: false,
    };
    return res.status(err.statusCode).json(response);
  }

  response = {
    status: statusCode,
    data: null,
    message: err.message || "Internal Server Error",
    success: false,
  };
  return res.status(statusCode).json(response);
};

export default errorHandler;
