import { Request, Response } from "express";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { addProductInFavourite } from "../../actions/favourite/add/addProductToFavourite.js";
import { redisClient } from "../../utils/cache/cache.js";
import { getFavouritesFromFirestore } from "../../actions/favourite/get/getAllFavouriteItems.js";
import { removeItemFromFavourite } from "../../actions/favourite/delete/deleteItemFromFavourite.js";
import { APIError } from "../../helpers/error/ApiError.js";

const addFavourite = asyncHandler(
  async (
    req: Request<{}, {}, { uid: string; productId: string }>,
    res: Response
  ) => {
    const { uid, productId } = req.body;
    let response: API.ApiResponse;

    if (!uid || !productId)
      throw new APIError("No uid or productId provided.", 400);

    await addProductInFavourite(uid, productId);
    await redisClient.del(`favourites:${uid}`);
    const updatedFavourites = await getFavouritesFromFirestore(uid);

    await redisClient.set(
      `favourites:${uid}`,
      JSON.stringify(updatedFavourites),
      {
        EX: 600,
      }
    );

    response = {
      status: 201,
      data: updatedFavourites,
      message: "Item successfully added into favourites.",
      success: true,
    };
    return res.status(201).json(response);
  }
);

const removeFavourites = asyncHandler(
  async (
    req: Request<{}, {}, { uid: string; productId: string }>,
    res: Response
  ) => {
    const { uid, productId } = req.body;

    if (!uid || !productId)
      throw new APIError("No uid or productId provided.", 400);

    await removeItemFromFavourite(uid, productId);
    await redisClient.del(`favourites:${uid}`);
    const updatedFavourites = await getFavouritesFromFirestore(uid);

    await redisClient.set(
      `favourites:${uid}`,
      JSON.stringify(updatedFavourites),
      {
        EX: 600,
      }
    );

    const response: API.ApiResponse = {
      status: 200,
      data: updatedFavourites,
      message: "Item successfully removed from favourites.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const getFavourites = asyncHandler(
  async (req: Request<{ uid: string }>, res: Response) => {
    const uid = req.params.uid;

    if (!uid) throw new APIError("No uid provided.", 400);

    const favouritesData = await getFavouritesFromFirestore(uid);
    await redisClient.setEx(
      `favourites:${uid}`,
      600,
      JSON.stringify(favouritesData)
    );

    const response: API.ApiResponse = {
      status: 200,
      data: favouritesData,
      message: "Favourites items successfully fetched.",
      success: true,
    };
    return res.status(200).json(response);
  }
);

export { addFavourite, removeFavourites, getFavourites };
