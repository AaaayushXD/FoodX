import { APIError } from "../../../../helpers/error/ApiError.js";

export const validateRevenueDate = (date: string) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  const isValidDate = dateRegex.test(date);

  if (!isValidDate) {
    throw new APIError(
      "Invalid date format. Please use YYYY-MM-DD format.",
      400
    );
  }

  const dateObject = new Date(date);
  if (isNaN(dateObject.getTime())) {
    throw new APIError("Invalid date. Please use a valid date.", 400);
  }

  return true;
};
