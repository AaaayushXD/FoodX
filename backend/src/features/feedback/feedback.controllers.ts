import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { PaginationSchemaType } from "../../utils/validate/pagination/paginationSchema.js";
import { fetchAllFeedback } from "../../actions/feedback/get/getAllFeedback.js";
import { FeedbackSchemaType } from "../../utils/validate/feedback/feedbackSchema.js";
import { addFeedback } from "../../actions/feedback/add/addFeedback.js";
import { deleteFeedbackFromDatabase } from "../../actions/feedback/delete/deleteFeedback.js";
import { APIError } from "../../helpers/error/ApiError.js";
import { updateFeedbackInDatabase } from "../../actions/feedback/update/updateFeedback.js";

const addFeedbacks = asyncHandler(
  async (req: Request<{}, {}, FeedbackSchemaType>, res: Response) => {
    const { message, productId, rating, uid, image } = req.body;

    const feedback = await addFeedback({
      message,
      productId,
      rating,
      userId: uid,
      image,
    });

    const response: API.ApiResponse = {
      status: 201,
      data: feedback,
      message: "Successfully added feedback in database.",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const fetchFeedbacks = asyncHandler(
  async (req: Request<{}, {}, PaginationSchemaType>, res: Response) => {
    let {
      pageSize,
      direction,
      currentFirstDoc,
      currentLastDoc,
      status,
      userId,
    } = req.body;

    const limitPage = pageSize ? +pageSize : 10;
    let { feedbacks, firstDoc, lastDoc, length } = await fetchAllFeedback(
      limitPage,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      userId
    );
    const response: API.ApiResponse = {
      status: 200,
      data: {
        feedbacks,
        currentFirstDoc: firstDoc,
        currentLastDoc: lastDoc,
        length,
      },
      message: "Successfully fetched feedbacks from database.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const deleteFeedback = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;

    const feedbackId = await deleteFeedbackFromDatabase(id);

    const response: API.ApiResponse = {
      status: 200,
      data: feedbackId,
      message: "Successfully deleted feedback from database.",
      success: true,
    };
  }
);

const updateFeedback = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    const id = req.params.id;

    const {
      field,
      newData,
    }: { field: keyof Feedback.FeedbackInfo; newData: string | number } =
      req.body;

    if (!field || !newData) {
      throw new APIError("No field or updated data provided.", 400);
    }

    const feedback = await updateFeedbackInDatabase(id, field, newData);

    const response: API.ApiResponse = {
      status: 200,
      data: feedback,
      message: "Successfully updated feedback in database.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

export { addFeedbacks, fetchFeedbacks, deleteFeedback, updateFeedback };
