import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { addNewCategoryInDatabase } from "../../actions/category/add/addCategory.js";
import { getAllCategoryFromDatabase } from "../../actions/category/get/getAllCategory.js";
import { redisClient } from "../../utils/cache/cache.js";
import { updateCategoryInDatabase } from "../../actions/category/update/updateCategory.js";
import { deleteCategoryFromDatabase } from "../../actions/category/delete/deleteCategory.js";
import { bulkDeleteCategoryFromDatabase } from "../../actions/category/delete/bulkDeleteCategory.js";
import { APIError } from "../../helpers/error/ApiError.js";

const addNewCategory = asyncHandler(
  async (
    req: Request<{}, {}, { name: string; image: string }>,
    res: Response
  ) => {
    const { name, image } = req.body;

    if (!name || !image) throw new APIError("No name or image provided.", 400);

    let response: API.ApiResponse;

    await addNewCategoryInDatabase(name, image);
    await redisClient.del("category");

    const updatedCategory = await getAllCategoryFromDatabase();
    await redisClient.set("category", JSON.stringify(updatedCategory), {
      EX: 3600,
    });

    response = {
      status: 201,
      data: updatedCategory,
      message: "New category added successfully",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const getAllCategory = asyncHandler(async (_: Request, res: Response) => {
  let response: API.ApiResponse;
  const categories = await getAllCategoryFromDatabase();

  await redisClient.set("category", JSON.stringify(categories), {
    EX: 3600,
  });
  response = {
    status: 200,
    data: categories,
    message: "Category fetched successfully",
    success: true,
  };
  return res.status(200).json(response);
});

const updateCategory = asyncHandler(
  async (
    req: Request<
      {},
      {},
      { id: string; field: "name" | "image"; newData: string }
    >,
    res: Response
  ) => {
    const { id, field, newData } = req.body;

    if (!id || !field || !newData)
      throw new APIError("No id, field or updated data provided.", 400);

    let response: API.ApiResponse;

    await updateCategoryInDatabase(id, field, newData);
    await redisClient.del("category");

    const updatedCategoryData = await getAllCategoryFromDatabase();
    await redisClient.set("category", JSON.stringify(updatedCategoryData), {
      EX: 3600,
    });

    response = {
      status: 200,
      data: updatedCategoryData,
      message: "Category updated successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const deleteCategory = asyncHandler(
  async (req: Request<{}, {}, { id: string }>, res: Response) => {
    const { id } = req.body;
    if (!id) throw new APIError("No id provided.", 400);

    let response: API.ApiResponse;
    await deleteCategoryFromDatabase(id);

    await redisClient.del("category");
    const updatedCategoryData = await getAllCategoryFromDatabase();
    await redisClient.set("category", JSON.stringify(updatedCategoryData), {
      EX: 3600,
    });

    response = {
      status: 200,
      data: updatedCategoryData,
      message: "Category deleted successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);
const deleteCategoriesInBulk = asyncHandler(
  async (req: Request<{}, {}, { ids: string[] }>, res: Response) => {
    const { ids } = req.body;
    if (!ids || ids.length < 1) throw new APIError("No ids provided.", 400);

    let response: API.ApiResponse;

    await bulkDeleteCategoryFromDatabase(ids);
    await redisClient.del("category");
    const updatedCategoryData = await getAllCategoryFromDatabase();

    await redisClient.set("category", JSON.stringify(updatedCategoryData), {
      EX: 3600,
    });

    response = {
      status: 200,
      data: updatedCategoryData,
      message: "Categories deleted successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);

export {
  addNewCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
  deleteCategoriesInBulk,
};
