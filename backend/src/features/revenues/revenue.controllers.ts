import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { addRevenueDataToFirestore } from "../../actions/revenue/add/addRevenueData.js";
import { getRevenueDataFromFirestore } from "../../actions/revenue/get/getRevenueData.js";
import { AddRevenueSchemaType } from "../../utils/validate/revenue/add/addRevenueSchema.js";
import { APIError } from "../../helpers/error/ApiError.js";
import { validateRevenueDate } from "../../utils/validate/revenue/get/validateRevenueDate.js";

const addRevenueData = asyncHandler(
  async (req: Request<{}, {}, AddRevenueSchemaType>, res: Response) => {
    const revenue = req.body;
    const revenueData = await addRevenueDataToFirestore(revenue);

    const response: API.ApiResponse = {
      status: 201,
      data: revenueData,
      message: "Revenue Added Successfully.",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const fetchRevenue = asyncHandler(
  async (
    req: Request<
      {},
      {},
      {
        startDate: string;
        endDate?: string;
      }
    >,
    res: Response
  ) => {
    let { startDate, endDate } = req.body;
    if (!startDate || !validateRevenueDate(startDate))
      throw new APIError("Start date is not valid.", 400);
    if (endDate && !validateRevenueDate(endDate))
      throw new APIError("End date is not valid.", 400);

    const revenue = await getRevenueDataFromFirestore(startDate, endDate);

    const response: API.ApiResponse = {
      status: 200,
      data: revenue,
      message: "Successfully fetched revenue from database",
      success: true,
    };
    return res.status(200).json(response);
  }
);

export { fetchRevenue, addRevenueData };
